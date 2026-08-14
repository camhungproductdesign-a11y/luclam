import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, 
  Check, 
  Copy, 
  Trash2, 
  FolderOpen, 
  FileImage, 
  FileVideo, 
  UserCheck, 
  LogOut, 
  RefreshCw, 
  FileCode, 
  Settings, 
  Globe, 
  MapPin, 
  Clock, 
  DollarSign, 
  AlertTriangle, 
  Search, 
  ChevronRight,
  Database,
  ArrowRight,
  Info,
  Sparkles,
  X
} from 'lucide-react';
import { googleSignIn, logout, getAccessToken } from '../firebaseAuth';
import { saveMedia, listMedia, deleteMedia, UploadedMedia, uploadMediaToServer } from '../indexedDBStore';
import { defaultMedia, imagePresets, videoPresets } from '../defaultMedia';
import { Language, translations } from '../translations';
import { getAdminToken, setAdminToken } from '../adminToken';

interface CreatorStudioProps {
  lang: Language;
  onLangChange: (lang: Language) => void;
  overrides: any;
  onUpdateOverrides: (newOverrides: any) => void;
  customMedia: Record<string, { img: string; video: string }>;
  onUpdateCustomMedia: (newCustomMedia: Record<string, { img: string; video: string }>) => void;
  onClose?: () => void;
  onForceRefresh: () => void;
  activeEditPlaceId?: string | null;
  onSetActiveEditPlaceId?: (id: string | null) => void;
  onDeactivateCreator?: () => void;
}

export function CreatorStudio({
  lang,
  onLangChange,
  overrides,
  onUpdateOverrides,
  customMedia,
  onUpdateCustomMedia,
  onClose,
  onForceRefresh,
  activeEditPlaceId,
  onSetActiveEditPlaceId,
  onDeactivateCreator
}: CreatorStudioProps) {
  const [activeStudioTab, setActiveStudioTab] = useState<'media' | 'content'>('media');
  const [activeLang, setActiveLang] = useState<Language>(lang);

  // Admin token for the guarded write endpoints. Entered by the operator and
  // kept in localStorage — it must never be baked into the bundle.
  const [adminToken, setAdminTokenState] = useState<string>(getAdminToken);

  const handleAdminTokenChange = (value: string) => {
    setAdminTokenState(value);
    setAdminToken(value);
  };

  // Auth state
  const [user, setUser] = useState<any>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Google Drive state
  const [driveFiles, setDriveFiles] = useState<any[]>([]);
  const [driveLoading, setDriveLoading] = useState(false);
  const [driveSearch, setDriveSearch] = useState('');
  const [driveError, setDriveError] = useState<string | null>(null);

  // IndexedDB State
  const [localMediaList, setLocalMediaList] = useState<UploadedMedia[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  // Copy State
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Form State
  const [selectedSection, setSelectedSection] = useState<string>('intro');
  const [activeFoodCatIdx, setActiveFoodCatIdx] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch local media items on mount
  const refreshLocalMedia = async () => {
    try {
      const list = await listMedia();
      setLocalMediaList(list);
    } catch (e) {
      console.error('Failed to list media:', e);
    }
  };

  useEffect(() => {
    refreshLocalMedia();
  }, []);

  // Monitor language prop
  useEffect(() => {
    setActiveLang(lang);
  }, [lang]);

  // Monitor activeEditPlaceId for deep-linking from detail modals
  useEffect(() => {
    if (activeEditPlaceId) {
      setActiveStudioTab('content');
      
      // Select appropriate section
      if (activeEditPlaceId.startsWith('food')) {
        setSelectedSection('food');
      } else if (activeEditPlaceId.startsWith('culture')) {
        setSelectedSection('culture');
      } else if (activeEditPlaceId.startsWith('shopping')) {
        setSelectedSection('shopping');
      } else if (activeEditPlaceId.startsWith('stay')) {
        setSelectedSection('stay');
      }

      // Smooth scroll to target place edit card
      setTimeout(() => {
        const el = document.getElementById(`edit-place-${activeEditPlaceId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('ring-2', 'ring-amber-500', 'ring-offset-2', 'ring-offset-zinc-950');
          setTimeout(() => {
            el.classList.remove('ring-2', 'ring-amber-500', 'ring-offset-2', 'ring-offset-zinc-950');
            if (onSetActiveEditPlaceId) {
              onSetActiveEditPlaceId(null);
            }
          }, 3000);
        }
      }, 400);
    }
  }, [activeEditPlaceId]);

  // Auth Status check on mount
  useEffect(() => {
    const checkToken = async () => {
      const token = await getAccessToken();
      if (token) {
        setAuthToken(token);
      }
    };
    checkToken();
  }, [user]);

  // Handle Google Drive Auth
  const handleGoogleSignIn = async () => {
    setIsLoggingIn(true);
    setDriveError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setAuthToken(result.accessToken);
        fetchDriveFiles(result.accessToken);
      }
    } catch (err: any) {
      console.error('Google Auth Failed:', err);
      setDriveError(err?.message || 'Google Drive authentication failed.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleSignOut = async () => {
    try {
      await logout();
      setUser(null);
      setAuthToken(null);
      setDriveFiles([]);
    } catch (err) {
      console.error('Sign Out Failed:', err);
    }
  };

  // Fetch Google Drive Files (Images and Videos)
  const fetchDriveFiles = async (token: string, searchName: string = '') => {
    setDriveLoading(true);
    setDriveError(null);
    try {
      // Query filter: images, videos, not in trash
      let q = "(mimeType contains 'image/' or mimeType contains 'video/') and trashed = false";
      if (searchName) {
        q += ` and name contains '${searchName.replace(/'/g, "\\'")}'`;
      }
      
      const endpoint = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=${encodeURIComponent('files(id,name,mimeType,thumbnailLink,webContentLink,size)')}&pageSize=30`;
      
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired, clear it
          handleGoogleSignOut();
          throw new Error('Google Drive session expired. Please sign in again.');
        }
        throw new Error('Failed to retrieve file list from Google Drive.');
      }

      const data = await response.json();
      setDriveFiles(data.files || []);
    } catch (err: any) {
      console.error('Drive Fetch Error:', err);
      setDriveError(err.message || 'Error fetching files from Google Drive.');
    } finally {
      setDriveLoading(false);
    }
  };

  const handleDriveSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authToken) {
      fetchDriveFiles(authToken, driveSearch);
    }
  };

  // Import file from Google Drive to Local IndexedDB Storage
  const importDriveFile = async (fileId: string, fileName: string, fileType: string) => {
    if (!authToken) return;
    setUploadProgress(`Importing '${fileName.substring(0, 15)}...'`);
    try {
      // Fetch binary data from Google Drive API
      const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!res.ok) {
        throw new Error('Failed to download media file from Google Drive.');
      }

      const blob = await res.blob();
      const file = new File([blob], fileName, { type: fileType });
      
      let serverUrl = '';
      try {
        setUploadProgress('Uploading to server...');
        const uploadRes = await uploadMediaToServer(file);
        serverUrl = uploadRes.url;
      } catch (uploadErr) {
        console.warn('Failed to upload to server, fallback to local only:', uploadErr);
      }
      
      const result = await saveMedia(file, serverUrl);
      await refreshLocalMedia();
      triggerToast(`Imported! ${serverUrl ? 'Saved to Server URL: ' + serverUrl : 'Local URL: ' + result.url}`);
    } catch (err: any) {
      console.error('Drive Import Error:', err);
      alert('Could not import file: ' + err.message);
    } finally {
      setUploadProgress(null);
    }
  };

  // Direct Drag and Drop / File Select Uploader
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
          alert(`File '${file.name}' is not an image or video!`);
          continue;
        }
        
        setUploadProgress(`Uploading ${file.name} to server (${i + 1}/${files.length})...`);
        let serverUrl = '';
        try {
          const uploadRes = await uploadMediaToServer(file);
          serverUrl = uploadRes.url;
        } catch (uploadErr) {
          console.warn('Failed to upload to server, fallback to local only:', uploadErr);
        }
        
        await saveMedia(file, serverUrl);
      }
      await refreshLocalMedia();
      triggerToast('Media files successfully uploaded!');
    } catch (e: any) {
      console.error('Upload Error:', e);
      alert('Failed to save file: ' + e.message);
    } finally {
      setUploadProgress(null);
    }
  };

  const handleDeleteLocalMedia = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this file from your Local Studio?')) {
      await deleteMedia(id);
      await refreshLocalMedia();
    }
  };

  // Clipboard Copier
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const triggerToast = (msg: string) => {
    setCopiedText(msg);
    setTimeout(() => setCopiedText(null), 2500);
  };

  // Update localized text overrides
  const updateOverrideValue = (path: string[], value: string) => {
    const updated = { ...overrides };
    let current = updated;
    
    // Ensure nested path exists
    if (!current[activeLang]) {
      current[activeLang] = {};
    }
    current = current[activeLang];

    for (let i = 0; i < path.length - 1; i++) {
      const part = path[i];
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part];
    }

    current[path[path.length - 1]] = value;
    onUpdateOverrides(updated);
    onForceRefresh();
  };

  // Update localized list overrides (arrays)
  const updateOverrideListValue = (path: string[], index: number, field: string, value: string) => {
    const updated = { ...overrides };
    let current = updated;
    
    if (!current[activeLang]) {
      current[activeLang] = {};
    }
    current = current[activeLang];

    for (let i = 0; i < path.length; i++) {
      const part = path[i];
      if (!current[part]) {
        current[part] =
          path[i] === 'items' ||
          path[i] === 'restaurants' ||
          path[i] === 'districts' ||
          path[i] === 'menuItems'
            ? []
            : {};
      }
      current = current[part];
    }

    // Ensure array index exists
    if (!current[index]) {
      current[index] = {};
    }
    current[index][field] = value;
    
    onUpdateOverrides(updated);
    onForceRefresh();
  };

  // Assign Media (Image or Video) to a PlaceId
  const assignMediaToPlace = (placeId: string, type: 'img' | 'video', url: string) => {
    const current = customMedia[placeId] || { img: '', video: '' };
    const nextMedia = {
      ...customMedia,
      [placeId]: {
        ...current,
        [type]: url
      }
    };
    onUpdateCustomMedia(nextMedia);
    onForceRefresh();
    triggerToast(`Assigned ${type} to ${placeId}!`);
  };

  const clearPlaceMedia = (placeId: string) => {
    const nextMedia = { ...customMedia };
    delete nextMedia[placeId];
    onUpdateCustomMedia(nextMedia);
    onForceRefresh();
    triggerToast(`Cleared custom media for ${placeId}`);
  };

  // Reset all custom configurations (overrides + media)
  const handleResetToDefaults = () => {
    if (window.confirm('⚠️ WARNING: This will reset ALL your content translations, custom descriptions, and image/video assignments back to the default values. This cannot be undone. Proceed?')) {
      localStorage.removeItem('saigon_guide_overrides');
      localStorage.removeItem('saigon_guide_custom_media');
      onUpdateOverrides({});
      onUpdateCustomMedia({});
      onForceRefresh();
      triggerToast('Reset to default guides successfully.');
    }
  };

  // Export current workspace state as JSON configuration block
  const handleExportConfig = () => {
    const config = {
      overrides,
      customMedia
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `saigon_pocket_guide_config_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    triggerToast('Config downloaded! You can share this JSON file.');
  };

  // Helpers to fetch current values (supporting overrides with defaults)
  const getIntroText = (field: 'heading' | 'p1' | 'p2' | 'highlight') => {
    return overrides[activeLang]?.welcome?.[field] ?? translations[activeLang]?.welcome?.[field] ?? '';
  };

  const getDistrictText = (didx: number, field: 'name' | 'description') => {
    return overrides[activeLang]?.atmosphere?.districts?.[didx]?.[field] ?? translations[activeLang]?.atmosphere?.districts?.[didx]?.[field] ?? '';
  };

  const getTransportText = () => {
    return overrides[activeLang]?.transport?.intro ?? translations[activeLang]?.transport?.intro ?? '';
  };

  const getStayText = () => {
    return overrides[activeLang]?.stay?.intro ?? translations[activeLang]?.stay?.intro ?? '';
  };

  const getFoodIntroText = () => {
    return overrides[activeLang]?.food?.intro ?? translations[activeLang]?.food?.intro ?? '';
  };

  const getCultureIntroText = () => {
    return overrides[activeLang]?.culture?.intro ?? translations[activeLang]?.culture?.intro ?? '';
  };

  const getShoppingIntroText = () => {
    return overrides[activeLang]?.shopping?.intro ?? translations[activeLang]?.shopping?.intro ?? '';
  };

  const getRestaurantValue = (catIdx: number, restIdx: number, field: string) => {
    return overrides[activeLang]?.food?.categories?.[catIdx]?.restaurants?.[restIdx]?.[field] ?? translations[activeLang]?.food?.categories?.[catIdx]?.restaurants?.[restIdx]?.[field] ?? '';
  };

  const getCultureValue = (itemIdx: number, field: string) => {
    return overrides[activeLang]?.culture?.items?.[itemIdx]?.[field] ?? translations[activeLang]?.culture?.items?.[itemIdx]?.[field] ?? '';
  };

  const getShoppingValue = (itemIdx: number, field: string) => {
    return overrides[activeLang]?.shopping?.items?.[itemIdx]?.[field] ?? translations[activeLang]?.shopping?.items?.[itemIdx]?.[field] ?? '';
  };

  const getProductValue = (itemIdx: number, field: string) => {
    return (overrides as any)[activeLang]?.luclam?.menuItems?.[itemIdx]?.[field]
      ?? (translations[activeLang] as any)?.luclam?.menuItems?.[itemIdx]?.[field]
      ?? '';
  };

  return (
    <div className="w-full h-full flex flex-col bg-zinc-950 border-l border-zinc-800 text-zinc-100 font-sans relative">
      
      {/* Studio Header */}
      <header className="p-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-[#b85233]" />
          <div>
            <h2 className="text-sm font-bold tracking-wide uppercase">Lục Lam Creator Studio</h2>
            <span className="text-[10px] text-zinc-400 block font-mono">Bản Thử Nghiệm Tự Động Lưu</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Main close button if inside drawer */}
          {onClose && (
            <button 
              onClick={onClose}
              className="lg:hidden min-h-11 text-white hover:bg-zinc-700 text-xs font-bold bg-zinc-800 px-4 py-2.5 rounded-xl flex items-center gap-2 border border-zinc-700"
              aria-label="Đóng Creator Studio"
            >
              <X className="w-4 h-4" />
              <span>Đóng</span>
            </button>
          )}
        </div>
      </header>

      {/* Admin token. Without it the server rejects every save with 401. */}
      <div className="px-4 py-2.5 bg-zinc-900/40 border-b border-zinc-800 shrink-0 flex items-center gap-3 flex-wrap">
        <label htmlFor="admin-token" className="text-[10px] uppercase tracking-wider font-bold text-zinc-400 shrink-0">
          Token quản trị
        </label>
        <input
          id="admin-token"
          type="password"
          value={adminToken}
          onChange={(e) => handleAdminTokenChange(e.target.value)}
          placeholder="Dán ADMIN_TOKEN của máy chủ"
          autoComplete="off"
          className="flex-1 min-w-[180px] bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-200 font-mono focus:outline-none focus:border-[#b85233]"
        />
        <span className={`text-[10px] font-mono shrink-0 ${adminToken ? 'text-emerald-400' : 'text-amber-400'}`}>
          {adminToken ? 'Đã có token' : 'Chưa nhập — mọi thao tác lưu sẽ bị từ chối'}
        </span>
      </div>

      {/* Primary Tab Navigation */}
      <div className="flex bg-zinc-900/60 border-b border-zinc-800 shrink-0">
        <button
          onClick={() => setActiveStudioTab('media')}
          className={`flex-1 py-3 text-xs font-bold tracking-wide transition-all border-b-2 flex items-center justify-center gap-1.5 cursor-pointer ${
            activeStudioTab === 'media'
              ? 'text-[#b85233] border-[#b85233] bg-zinc-800/40'
              : 'text-zinc-400 border-transparent hover:text-zinc-200'
          }`}
        >
          <FolderOpen className="w-3.5 h-3.5" />
          <span>📸 Thư Viện Media & Drive</span>
        </button>
        <button
          onClick={() => setActiveStudioTab('content')}
          className={`flex-1 py-3 text-xs font-bold tracking-wide transition-all border-b-2 flex items-center justify-center gap-1.5 cursor-pointer ${
            activeStudioTab === 'content'
              ? 'text-[#b85233] border-[#b85233] bg-zinc-800/40'
              : 'text-zinc-400 border-transparent hover:text-zinc-200'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>✍️ Chỉnh Sửa Nội Dung & Dịch</span>
        </button>
      </div>

      {/* TAB CONTAINER BODY */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">

        {/* --- TOAST NOTIFICATION FLOATING --- */}
        {copiedText && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#b85233] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xl z-50 animate-bounce">
            {copiedText}
          </div>
        )}

        {/* ==========================================================================
            MEDIA LIBRARY & GOOGLE DRIVE HOST TAB
            ========================================================================== */}
        {activeStudioTab === 'media' && (
          <div className="space-y-6">

            {/* Custom Cover Page Background Settings */}
            <div id="edit-place-cover" className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4 space-y-3 transition-all duration-300">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-amber-500/10 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider">Ảnh Bìa Pocket Guide</h3>
                    <span className="text-[8px] text-zinc-500 block uppercase font-mono">Bản Thiết Kế Cover Page</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] text-zinc-400 leading-relaxed">
                  Thiết lập ảnh nền chất lượng cao cho trang bìa cuốn cẩm nang. Bạn có thể dán đường dẫn hình ảnh tùy chỉnh hoặc chọn từ kho ảnh có sẵn phía dưới.
                </p>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 font-semibold">Đường dẫn ảnh bìa:</label>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      value={customMedia.cover?.img || "https://images.unsplash.com/photo-1509060464153-4466739f78ad?auto=format&fit=crop&w=1200&q=80"}
                      onChange={(e) => {
                        const nextMedia = {
                          ...customMedia,
                          cover: {
                            img: e.target.value,
                            video: ''
                          }
                        };
                        onUpdateCustomMedia(nextMedia);
                      }}
                      placeholder="Dán link ảnh bìa (Unsplash, Drive...)..."
                      className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-500 text-zinc-300 font-mono"
                    />
                    {customMedia.cover?.img && (
                      <button 
                        type="button"
                        onClick={() => {
                          const nextMedia = { ...customMedia };
                          delete nextMedia.cover;
                          onUpdateCustomMedia(nextMedia);
                        }}
                        className="bg-red-950/40 text-red-400 hover:bg-red-950 px-2.5 rounded-lg text-[10px] border border-red-500/10 cursor-pointer"
                      >
                        Khôi Phục
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Google Drive Integration Segment */}
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Globe className="w-4 h-4 text-blue-400" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-wider">Lấy Ảnh/Video từ Google Drive</h3>
                </div>
                {authToken && (
                  <button 
                    onClick={handleGoogleSignOut}
                    className="text-[10px] text-red-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <LogOut className="w-3 h-3" />
                    Đăng xuất Drive
                  </button>
                )}
              </div>

              {!authToken ? (
                <div className="py-4 text-center space-y-3">
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                    Kết nối tài khoản Google Drive để trực tiếp duyệt tìm kiếm toàn bộ kho ảnh/video và liên kết hoặc tải chúng vào ứng dụng.
                  </p>
                  
                  {/* Google Material Button Standard */}
                  <button 
                    onClick={handleGoogleSignIn}
                    disabled={isLoggingIn}
                    className="mx-auto flex items-center gap-2 bg-white text-zinc-900 hover:bg-zinc-100 font-bold text-xs py-2.5 px-4 rounded-xl shadow transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isLoggingIn ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-zinc-900" />
                    ) : (
                      <svg className="w-4 h-4" viewBox="0 0 48 48">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                      </svg>
                    )}
                    <span>Đăng Nhập Google Drive</span>
                  </button>
                  {driveError && (
                    <div className="text-[10px] text-red-400 p-2 bg-red-950/20 rounded-lg flex items-center gap-1.5 justify-center max-w-xs mx-auto">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>{driveError}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Google Drive Search */}
                  <form onSubmit={handleDriveSearchSubmit} className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text" 
                        placeholder="Tìm kiếm file ảnh, video trong Drive..."
                        value={driveSearch}
                        onChange={(e) => setDriveSearch(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 rounded-xl transition-all cursor-pointer"
                    >
                      Tìm
                    </button>
                  </form>

                  {driveLoading ? (
                    <div className="py-6 text-center text-xs text-zinc-400 flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                      <span>Đang tải tệp tin từ Google Drive...</span>
                    </div>
                  ) : driveFiles.length === 0 ? (
                    <p className="text-[10px] text-zinc-400 text-center py-4">Không tìm thấy ảnh hoặc video nào trong Google Drive.</p>
                  ) : (
                    /* Drive Files Scroll Grid */
                    <div className="grid grid-cols-2 gap-3.5 max-h-[220px] overflow-y-auto pr-1">
                      {driveFiles.map((file) => (
                        <div key={file.id} className="bg-zinc-950 border border-zinc-800 rounded-xl p-2 flex flex-col justify-between space-y-2 text-[10px]">
                          <div className="flex gap-2">
                            {file.thumbnailLink ? (
                              <img
                                src={file.thumbnailLink}
                                alt=""
                                width={40}
                                height={40}
                                loading="lazy"
                                decoding="async"
                                className="w-10 h-10 object-cover rounded-lg shrink-0 bg-zinc-900 border border-zinc-800"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center shrink-0 border border-zinc-800">
                                {file.mimeType?.startsWith('video/') ? <FileVideo className="w-5 h-5 text-purple-400" /> : <FileImage className="w-5 h-5 text-blue-400" />}
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-medium truncate text-zinc-300" title={file.name}>{file.name}</p>
                              <span className="text-[8px] text-zinc-500 block uppercase tracking-wider">{file.mimeType?.split('/')[1] || 'media'}</span>
                            </div>
                          </div>

                          <div className="flex gap-1.5 pt-1 border-t border-zinc-900">
                            <button 
                              onClick={() => {
                                // Assign directly as a WebContent Link
                                const url = file.webContentLink || `https://drive.google.com/uc?export=view&id=${file.id}`;
                                copyToClipboard(url);
                                triggerToast('Copied Drive link to clipboard!');
                              }}
                              className="flex-1 bg-zinc-800 hover:bg-zinc-700 py-1 rounded text-center font-medium text-[8.5px] cursor-pointer"
                              title="Sao chép đường dẫn Google Drive của file này"
                            >
                              Lấy Link
                            </button>
                            <button 
                              onClick={() => importDriveFile(file.id, file.name, file.mimeType)}
                              disabled={uploadProgress !== null}
                              className="flex-1 bg-blue-950 text-blue-300 hover:bg-blue-900 py-1 rounded text-center font-medium text-[8.5px] disabled:opacity-50 cursor-pointer"
                              title="Tải tệp này về máy ảo, lưu thẳng vào thư viện offline của bạn"
                            >
                              Tải Về Studio
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Drag & Drop File Local Uploader */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Tải Ảnh / Video Trực Tiếp (Lưu IndexedDB)</h3>
              
              <div 
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  handleFileUpload(e.dataTransfer.files);
                }}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-2 ${
                  isDragging 
                    ? 'border-[#b85233] bg-[#b85233]/10 text-[#b85233]' 
                    : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 text-zinc-400'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden" 
                  multiple 
                  accept="image/*,video/*" 
                />
                <Upload className="w-8 h-8 text-[#b85233]/80 animate-bounce" />
                <div>
                  <p className="text-xs font-bold text-zinc-200">Kéo thả Ảnh / Video hoặc nhấp để tải lên</p>
                  <p className="text-[10px] text-zinc-500 mt-1">Được lưu hoàn toàn trên trình duyệt của bạn (Offline IndexedDB Store)</p>
                </div>
              </div>

              {uploadProgress && (
                <div className="bg-[#b85233]/15 text-[#b85233] border border-[#b85233]/30 rounded-xl p-3 text-xs flex items-center justify-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{uploadProgress}</span>
                </div>
              )}
            </div>

            {/* My Local Media Gallery List */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Kho Ảnh Tự Tải Lên ({localMediaList.length})</h3>
                {localMediaList.length > 0 && (
                  <span className="text-[8px] uppercase font-mono px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-400">Local DB Store</span>
                )}
              </div>

              {localMediaList.length === 0 ? (
                <div className="p-8 text-center bg-zinc-900/20 border border-zinc-900 rounded-2xl">
                  <p className="text-[10px] text-zinc-500 font-serif italic">Thư viện trống. Hãy kéo thả ảnh của bạn lên trên nhé!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3.5">
                  {localMediaList.map((item) => (
                    <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden p-2.5 flex flex-col justify-between space-y-2 text-[10px]">
                      <div className="space-y-1.5">
                        {/* Preview inside Studio card */}
                        <div className="w-full h-20 rounded-lg overflow-hidden bg-zinc-950 border border-zinc-800 relative">
                          {item.type.startsWith('video/') ? (
                            <div className="w-full h-full flex items-center justify-center text-purple-400 bg-zinc-950">
                              <FileVideo className="w-8 h-8" />
                              <span className="absolute bottom-1 right-1 text-[8px] bg-black/80 px-1 py-0.5 rounded uppercase">Video</span>
                            </div>
                          ) : (
                            <img
                              src={item.serverUrl || `indexeddb-media://${item.id}`}
                              alt={item.name}
                              width={64}
                              height={64}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback if the raw protocol is not parsed here.
                                // The flag stops the handler from reassigning a src
                                // that is itself broken, which loops forever.
                                const image = e.currentTarget;
                                if (image.dataset.fallbackApplied === 'true') {
                                  image.style.display = 'none';
                                  return;
                                }
                                image.dataset.fallbackApplied = 'true';
                                image.src = '/uploads/cover_benthanh.jpg';
                              }}
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold truncate text-zinc-300" title={item.name}>{item.name}</p>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[8px] text-zinc-500 uppercase tracking-wider font-mono">{(item.size / 1024 / 1024).toFixed(2)} MB</span>
                            {item.serverUrl && (
                              <span className="text-[7px] text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-800/30 px-1 py-0.2 rounded font-mono uppercase">Synced</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-1 border-t border-zinc-800">
                        <button 
                          onClick={() => {
                            const url = item.serverUrl || `indexeddb-media://${item.id}`;
                            copyToClipboard(url);
                            triggerToast(`Copied! ${url}`);
                          }}
                          className="flex-1 bg-zinc-800 hover:bg-zinc-700 py-1.5 rounded-lg font-bold flex items-center justify-center gap-1 text-[9px] cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy URL</span>
                        </button>
                        <button 
                          onClick={() => handleDeleteLocalMedia(item.id)}
                          className="p-1.5 bg-red-950/40 text-red-400 hover:bg-red-900 hover:text-white rounded-lg transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Curated Premium Saigon Stock Presets */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Ảnh / Video Sài Gòn Cực Đẹp Có Sẵn</h3>
              
              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4 space-y-4">
                
                {/* Video loops presets */}
                <div className="space-y-2">
                  <h4 className="text-[10px] uppercase tracking-wider text-[#b85233] font-bold">🎬 Video Loops (Tự Động Phát & Vô Tận)</h4>
                  <div className="space-y-1.5">
                    {videoPresets.map((v, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[10px] bg-zinc-950 p-2 rounded-xl border border-zinc-800/60">
                        <div className="min-w-0 pr-2">
                          <span className="text-[8px] px-1 py-0.5 bg-purple-950 text-purple-300 rounded font-mono uppercase tracking-wide mr-1.5">{v.category}</span>
                          <span className="font-medium text-zinc-300">{v.name}</span>
                        </div>
                        <button 
                          onClick={() => {
                            copyToClipboard(v.url);
                            triggerToast('Copied video link!');
                          }}
                          className="bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded text-[9px] font-bold cursor-pointer"
                        >
                          Copy Link
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Image presets */}
                <div className="space-y-2">
                  <h4 className="text-[10px] uppercase tracking-wider text-[#b85233] font-bold">🖼️ High-Quality Stock Photos (Unsplash)</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {imagePresets.map((img, idx) => (
                      <div key={idx} className="bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800/60 flex flex-col justify-between">
                        <img
                          src={img.url}
                          alt={img.name}
                          width={200}
                          height={48}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-12 object-cover"
                        />
                        <div className="p-1.5 flex justify-between items-center gap-1">
                          <span className="truncate text-[8px] text-zinc-400" title={img.name}>{img.name}</span>
                          <button 
                            onClick={() => {
                              copyToClipboard(img.url);
                              triggerToast('Copied photo link!');
                            }}
                            className="bg-zinc-800 hover:bg-zinc-700 p-1 rounded cursor-pointer"
                            title="Copy Photo Link"
                          >
                            <Copy className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* ==========================================================================
            MULTILINGUAL CONTENT EDITOR TAB
            ========================================================================== */}
        {activeStudioTab === 'content' && (
          <div className="space-y-6">

            {/* Language Selection Segment */}
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-300">
                <Globe className="w-4 h-4 text-[#b85233]" />
                <span>Chọn ngôn ngữ muốn chỉnh sửa:</span>
              </div>
              <div className="grid grid-cols-6 gap-1">
                {(['vi', 'en', 'zht', 'zh', 'ja', 'ko'] as const).map((l) => {
                  const isSelected = activeLang === l;
                  const labelInfo = {
                    vi: { text: 'Tiếng Việt', flag: '🇻🇳' },
                    en: { text: 'English', flag: '🇺🇸' },
                    zht: { text: '繁體中文', flag: '🇹🇼' },
                    zh: { text: '简体中文', flag: '🇨🇳' },
                    ja: { text: '日本語', flag: '🇯🇵' },
                    ko: { text: '한국어', flag: '🇰🇷' }
                  }[l];
                  return (
                    <button
                      key={l}
                      onClick={() => {
                        setActiveLang(l);
                        onLangChange(l);
                      }}
                      className={`py-2 px-0.5 rounded-xl text-[9px] font-bold text-center border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        isSelected
                          ? 'bg-[#b85233] text-white border-[#b85233]'
                          : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <span className="text-xs">{labelInfo.flag}</span>
                      <span className="truncate w-full text-center">{labelInfo.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content Category Section Picker */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Chọn Mục Nội Dung Cần Sửa:</label>
              <select 
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs focus:outline-none focus:border-[#b85233]"
              >
                <option value="intro">Lời Mở Đầu (Welcome Intro)</option>
                <option value="districts">Không Khí Các Quận (Atmosphere)</option>
                <option value="transport">Phương Tiện Di Chuyển (Transport)</option>
                <option value="stay">Khách Sạn & Spa (Stay & Spa)</option>
                <option value="food">Ẩm Thực 5 Danh Mục (Legends Food)</option>
                <option value="culture">Địa Điểm Check-In (Culture)</option>
                <option value="shopping">Mua Sắm Đặc Sản (Shopping)</option>
                <option value="products">Sản Phẩm Trà Lục Lam (Products)</option>
              </select>
            </div>

            {/* DYNAMIC FORM SEGMENTS */}
            <div className="bg-zinc-900/40 rounded-2xl border border-zinc-900 p-4 space-y-4">

              {/* SECTION: INTRO (Cover & Welcome) */}
              {selectedSection === 'intro' && (
                <div className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-zinc-400 font-medium">Tiêu đề Mở Đầu:</label>
                    <textarea 
                      value={getIntroText('heading')}
                      onChange={(e) => updateOverrideValue(['welcome', 'heading'], e.target.value)}
                      placeholder="Nhập tiêu đề đón chào..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 min-h-[70px] focus:outline-none focus:border-[#b85233]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-zinc-400 font-medium">Đoạn văn 1 (Giới thiệu):</label>
                    <textarea 
                      value={getIntroText('p1')}
                      onChange={(e) => updateOverrideValue(['welcome', 'p1'], e.target.value)}
                      placeholder="Mô tả tóm tắt..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 min-h-[90px] focus:outline-none focus:border-[#b85233]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-zinc-400 font-medium">Đoạn văn 2:</label>
                    <textarea 
                      value={getIntroText('p2')}
                      onChange={(e) => updateOverrideValue(['welcome', 'p2'], e.target.value)}
                      placeholder="Mô tả bổ sung..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 min-h-[90px] focus:outline-none focus:border-[#b85233]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-zinc-400 font-medium">Slogan nổi bật (Dưới cùng):</label>
                    <input 
                      type="text"
                      value={getIntroText('highlight')}
                      onChange={(e) => updateOverrideValue(['welcome', 'highlight'], e.target.value)}
                      placeholder="Ví dụ: Sài Gòn đang chờ đợi bạn..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 focus:outline-none focus:border-[#b85233]"
                    />
                  </div>
                </div>
              )}

              {/* SECTION: DISTRICTS */}
              {selectedSection === 'districts' && (
                <div className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-zinc-400 font-medium">Lời dẫn Không khí các Quận:</label>
                    <textarea 
                      value={overrides[activeLang]?.atmosphere?.description || ''}
                      onChange={(e) => updateOverrideValue(['atmosphere', 'description'], e.target.value)}
                      placeholder="Giới thiệu chung về các quận..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 min-h-[70px] focus:outline-none focus:border-[#b85233]"
                    />
                  </div>

                  <span className="block border-t border-zinc-800 pt-3 text-[10px] uppercase font-bold text-[#b85233]">Chi Tiết Từng Quận</span>
                  
                  {(translations[activeLang]?.atmosphere?.districts || []).map((district, idx) => {
                    return (
                      <div key={idx} className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-3">
                        <div className="space-y-1">
                          <label className="text-zinc-500 font-semibold">Tên Quận {idx + 1} ({district.name}):</label>
                          <input 
                            type="text"
                            value={getDistrictText(idx, 'name')}
                            onChange={(e) => updateOverrideListValue(['atmosphere', 'districts'], idx, 'name', e.target.value)}
                            placeholder="Tên quận..."
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 focus:outline-none focus:border-[#b85233]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-zinc-500 font-semibold">Mô tả Không Khí:</label>
                          <textarea 
                            value={getDistrictText(idx, 'description')}
                            onChange={(e) => updateOverrideListValue(['atmosphere', 'districts'], idx, 'description', e.target.value)}
                            placeholder="Mô tả không khí đặc sắc..."
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 min-h-[60px] focus:outline-none focus:border-[#b85233]"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* SECTION: TRANSPORTATION */}
              {selectedSection === 'transport' && (
                <div className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-zinc-400 font-medium">Giới thiệu Di chuyển & An toàn:</label>
                    <textarea 
                      value={getTransportText()}
                      onChange={(e) => updateOverrideValue(['transport', 'intro'], e.target.value)}
                      placeholder="Mô tả chung..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 min-h-[100px] focus:outline-none focus:border-[#b85233]"
                    />
                  </div>
                </div>
              )}

              {/* SECTION: STAY & SPA */}
              {selectedSection === 'stay' && (
                <div className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-zinc-400 font-medium">Mở đầu Khách sạn & Trị liệu:</label>
                    <textarea 
                      value={getStayText()}
                      onChange={(e) => updateOverrideValue(['stay', 'intro'], e.target.value)}
                      placeholder="Lời dẫn nghỉ ngơi..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 min-h-[100px] focus:outline-none focus:border-[#b85233]"
                    />
                  </div>
                </div>
              )}

              {/* SECTION: FOOD ( ẩm thực 5 danh mục ) */}
              {selectedSection === 'food' && (
                <div className="space-y-4 text-xs animate-in fade-in duration-300">
                  
                  <div className="space-y-1.5">
                    <label className="text-zinc-400 font-medium">Giới thiệu Ẩm Thực:</label>
                    <textarea 
                      value={getFoodIntroText()}
                      onChange={(e) => updateOverrideValue(['food', 'intro'], e.target.value)}
                      placeholder="Mô tả chung ẩm thực..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 min-h-[60px] focus:outline-none focus:border-[#b85233]"
                    />
                  </div>

                  {/* Horizontal Categories selector inside Editor to jump to category */}
                  <div className="space-y-1.5 border-t border-zinc-800 pt-3">
                    <label className="text-[#b85233] font-bold uppercase text-[9px] tracking-wide block">Cuộn nhanh đến danh mục:</label>
                    <div className="flex gap-1 overflow-x-auto pb-1 pt-1 no-scrollbar">
                      {(translations[activeLang]?.food?.categories || []).map((cat, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            const el = document.getElementById(`edit-food-cat-${idx}`);
                            if (el) {
                              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                          }}
                          className="px-3 py-1.5 rounded-xl text-[9px] font-bold shrink-0 transition-all cursor-pointer bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800/50"
                        >
                          {cat.title} {cat.emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  <span className="block border-t border-zinc-800 pt-2 text-[10px] font-bold text-zinc-400 uppercase">
                    Danh Sách Quán Ăn Thuộc Các Danh Mục:
                  </span>

                  {(translations[activeLang]?.food?.categories || []).map((cat, catIdx) => {
                    const catName = `${cat.title} ${cat.emoji}`;
                    return (
                      <div key={catIdx} id={`edit-food-cat-${catIdx}`} className="space-y-4 border-t border-zinc-800/80 pt-4 first:border-t-0 first:pt-0">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-[#b85233] rounded-full"></span>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-500 font-serif">{catName}</h4>
                        </div>

                        {(cat.restaurants || []).map((rest, restIdx) => {
                          const placeId = `food-${catIdx}-${restIdx}`;
                          const currentCustom = customMedia[placeId] || { img: '', video: '' };
                          const defaultMediaItem = defaultMedia[placeId] || { img: '', video: '' };

                          return (
                            <div key={restIdx} id={`edit-place-${placeId}`} className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-3 transition-all duration-300">
                              <span className="text-[10px] font-bold text-[#b85233] font-mono">Quán Ăn #{restIdx + 1} ({rest.name})</span>
                              
                              <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                  <label className="text-zinc-500 font-semibold">Tên Quán:</label>
                                  <input 
                                    type="text"
                                    value={getRestaurantValue(catIdx, restIdx, 'name')}
                                    onChange={(e) => updateOverrideListValue(['food', 'categories', String(catIdx), 'restaurants'], restIdx, 'name', e.target.value)}
                                    placeholder="Tên quán..."
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 focus:outline-none focus:border-[#b85233]"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-zinc-500 font-semibold">Đặc sản / Tóm tắt:</label>
                                  <input 
                                    type="text"
                                    value={getRestaurantValue(catIdx, restIdx, 'sub')}
                                    onChange={(e) => updateOverrideListValue(['food', 'categories', String(catIdx), 'restaurants'], restIdx, 'sub', e.target.value)}
                                    placeholder="Món tủ..."
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 focus:outline-none focus:border-[#b85233]"
                                  />
                                </div>
                              </div>

                              <div className="space-y-1">
                                <label className="text-zinc-500 font-semibold">Mô tả hương vị & đánh giá chi tiết:</label>
                                <textarea 
                                  value={getRestaurantValue(catIdx, restIdx, 'desc')}
                                  onChange={(e) => updateOverrideListValue(['food', 'categories', String(catIdx), 'restaurants'], restIdx, 'desc', e.target.value)}
                                  placeholder="Mô tả chi tiết..."
                                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 min-h-[60px] focus:outline-none focus:border-[#b85233]"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                  <label className="text-zinc-500 font-semibold">Địa chỉ:</label>
                                  <input 
                                    type="text"
                                    value={getRestaurantValue(catIdx, restIdx, 'addr')}
                                    onChange={(e) => updateOverrideListValue(['food', 'categories', String(catIdx), 'restaurants'], restIdx, 'addr', e.target.value)}
                                    placeholder="Địa chỉ..."
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 focus:outline-none focus:border-[#b85233]"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-zinc-500 font-semibold">Giờ mở cửa:</label>
                                  <input 
                                    type="text"
                                    value={getRestaurantValue(catIdx, restIdx, 'hours')}
                                    onChange={(e) => updateOverrideListValue(['food', 'categories', String(catIdx), 'restaurants'], restIdx, 'hours', e.target.value)}
                                    placeholder="Giờ mở..."
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 focus:outline-none focus:border-[#b85233]"
                                  />
                                </div>
                              </div>

                              <div className="space-y-1">
                                <label className="text-zinc-500 font-semibold">Khoảng giá:</label>
                                <input 
                                  type="text"
                                  value={getRestaurantValue(catIdx, restIdx, 'price')}
                                  onChange={(e) => updateOverrideListValue(['food', 'categories', String(catIdx), 'restaurants'], restIdx, 'price', e.target.value)}
                                  placeholder="Giá ví dụ: 50.000đ - 100.000đ"
                                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 focus:outline-none focus:border-[#b85233]"
                                />
                              </div>

                              {/* Assign Media URLs for each Food item */}
                              <div className="pt-2 border-t border-zinc-900 space-y-2">
                                <span className="text-[9px] uppercase tracking-wide font-bold text-zinc-500">Gán Media Cho Quán:</span>
                                
                                <div className="grid grid-cols-2 gap-2 text-[10px]">
                                  <div className="space-y-1">
                                    <label className="text-zinc-400">Hình ảnh URL:</label>
                                    <input 
                                      type="text"
                                      value={currentCustom.img || defaultMediaItem.img}
                                      onChange={(e) => assignMediaToPlace(placeId, 'img', e.target.value)}
                                      placeholder="Gán link ảnh..."
                                      className="w-full bg-zinc-900 border border-zinc-800 rounded p-1 text-[9px] focus:outline-none text-zinc-300"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-zinc-400">Video URL (Loops):</label>
                                    <input 
                                      type="text"
                                      value={currentCustom.video || defaultMediaItem.video}
                                      onChange={(e) => assignMediaToPlace(placeId, 'video', e.target.value)}
                                      placeholder="Gán link video..."
                                      className="w-full bg-zinc-900 border border-zinc-800 rounded p-1 text-[9px] focus:outline-none text-zinc-300"
                                    />
                                  </div>
                                </div>
                                {(currentCustom.img || currentCustom.video) && (
                                  <button 
                                    type="button" 
                                    onClick={() => clearPlaceMedia(placeId)}
                                    className="text-[8.5px] text-red-400 hover:underline cursor-pointer block mt-1"
                                  >
                                    Xóa thiết lập media tùy chỉnh (Khôi phục mặc định)
                                  </button>
                                )}
                              </div>

                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* SECTION: CULTURE / CHECK-IN PLACES */}
              {selectedSection === 'culture' && (
                <div className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-zinc-400 font-medium">Giới thiệu văn hóa:</label>
                    <textarea 
                      value={getCultureIntroText()}
                      onChange={(e) => updateOverrideValue(['culture', 'intro'], e.target.value)}
                      placeholder="Mô tả chung..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 min-h-[60px] focus:outline-none focus:border-[#b85233]"
                    />
                  </div>

                  <span className="block border-t border-zinc-800 pt-2 text-[10px] font-bold text-zinc-400 uppercase">
                    Chi Tiết Địa Điểm Check-In ({translations[activeLang]?.culture?.items?.length || 26} Địa Điểm):
                  </span>

                  {(translations[activeLang]?.culture?.items || []).map((item, itemIdx) => {
                    const placeId = `culture-${itemIdx}`;
                    const currentCustom = customMedia[placeId] || { img: '', video: '' };
                    const defaultMediaItem = defaultMedia[placeId] || { img: '', video: '' };

                    return (
                      <div key={itemIdx} id={`edit-place-${placeId}`} className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-3 transition-all duration-300">
                        <span className="text-[10px] font-bold text-amber-500 font-mono">Địa Điểm #{itemIdx + 1} ({item.name || `Địa điểm ${itemIdx + 1}`})</span>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-zinc-500 font-semibold">Tên địa điểm:</label>
                            <input 
                              type="text"
                              value={getCultureValue(itemIdx, 'name')}
                              onChange={(e) => updateOverrideListValue(['culture', 'items'], itemIdx, 'name', e.target.value)}
                              placeholder="Tên địa danh..."
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 focus:outline-none focus:border-[#b85233]"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-zinc-500 font-semibold">Tóm tắt / Đặc điểm:</label>
                            <input 
                              type="text"
                              value={getCultureValue(itemIdx, 'sub')}
                              onChange={(e) => updateOverrideListValue(['culture', 'items'], itemIdx, 'sub', e.target.value)}
                              placeholder="Sub tag..."
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 focus:outline-none focus:border-[#b85233]"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-zinc-500 font-semibold">Mô tả văn hóa chi tiết:</label>
                          <textarea 
                            value={getCultureValue(itemIdx, 'desc')}
                            onChange={(e) => updateOverrideListValue(['culture', 'items'], itemIdx, 'desc', e.target.value)}
                            placeholder="Mô tả chi tiết..."
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 min-h-[60px] focus:outline-none focus:border-[#b85233]"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-zinc-500 font-semibold">Địa chỉ:</label>
                            <input 
                              type="text"
                              value={getCultureValue(itemIdx, 'addr')}
                              onChange={(e) => updateOverrideListValue(['culture', 'items'], itemIdx, 'addr', e.target.value)}
                              placeholder="Địa chỉ..."
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 focus:outline-none focus:border-[#b85233]"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-zinc-500 font-semibold">Giờ mở cửa:</label>
                            <input 
                              type="text"
                              value={getCultureValue(itemIdx, 'hours')}
                              onChange={(e) => updateOverrideListValue(['culture', 'items'], itemIdx, 'hours', e.target.value)}
                              placeholder="Giờ mở..."
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 focus:outline-none focus:border-[#b85233]"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-zinc-500 font-semibold">Vé vào cửa / Chi phí:</label>
                          <input 
                            type="text"
                            value={getCultureValue(itemIdx, 'price')}
                            onChange={(e) => updateOverrideListValue(['culture', 'items'], itemIdx, 'price', e.target.value)}
                            placeholder="Vé/Phí..."
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 focus:outline-none focus:border-[#b85233]"
                          />
                        </div>

                        {/* Assign Media URLs for each Culture item */}
                        <div className="pt-2 border-t border-zinc-900 space-y-2">
                          <span className="text-[9px] uppercase tracking-wide font-bold text-zinc-500">Gán Media Cho Địa Điểm:</span>
                          
                          <div className="grid grid-cols-2 gap-2 text-[10px]">
                            <div className="space-y-1">
                              <label className="text-zinc-400">Hình ảnh URL:</label>
                              <input 
                                type="text"
                                value={currentCustom.img || defaultMediaItem.img}
                                onChange={(e) => assignMediaToPlace(placeId, 'img', e.target.value)}
                                placeholder="Gán link ảnh..."
                                className="w-full bg-zinc-900 border border-zinc-800 rounded p-1 text-[9px] focus:outline-none text-zinc-300"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-zinc-400">Video URL (Loops):</label>
                              <input 
                                type="text"
                                value={currentCustom.video || defaultMediaItem.video}
                                onChange={(e) => assignMediaToPlace(placeId, 'video', e.target.value)}
                                placeholder="Gán link video..."
                                className="w-full bg-zinc-900 border border-zinc-800 rounded p-1 text-[9px] focus:outline-none text-zinc-300"
                              />
                            </div>
                          </div>
                          {(currentCustom.img || currentCustom.video) && (
                            <button 
                              type="button" 
                              onClick={() => clearPlaceMedia(placeId)}
                              className="text-[8.5px] text-red-400 hover:underline cursor-pointer block mt-1"
                            >
                              Xóa thiết lập media tùy chỉnh (Khôi phục mặc định)
                            </button>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

              {/* SECTION: SHOPPING */}
              {selectedSection === 'shopping' && (
                <div className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-zinc-400 font-medium">Lời mở đầu Mua Sắm:</label>
                    <textarea 
                      value={getShoppingIntroText()}
                      onChange={(e) => updateOverrideValue(['shopping', 'intro'], e.target.value)}
                      placeholder="Mô tả mua sắm..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 min-h-[60px] focus:outline-none focus:border-[#b85233]"
                    />
                  </div>

                  <span className="block border-t border-zinc-800 pt-2 text-[10px] font-bold text-zinc-400 uppercase">
                    Chi Tiết Địa Điểm Mua Sắm ({translations[activeLang]?.shopping?.items?.length || 3} Địa Điểm):
                  </span>

                  {(translations[activeLang]?.shopping?.items || []).map((item, itemIdx) => {
                    const placeId = `shopping-${itemIdx}`;
                    const currentCustom = customMedia[placeId] || { img: '', video: '' };
                    const defaultMediaItem = defaultMedia[placeId] || { img: '', video: '' };

                    return (
                      <div key={itemIdx} id={`edit-place-${placeId}`} className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-3 transition-all duration-300">
                        <span className="text-[10px] font-bold text-amber-500 font-mono">Điểm mua sắm #{itemIdx + 1} ({item.name || `Địa điểm ${itemIdx + 1}`})</span>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-zinc-500 font-semibold">Tên chợ:</label>
                            <input 
                              type="text"
                              value={getShoppingValue(itemIdx, 'name')}
                              onChange={(e) => updateOverrideListValue(['shopping', 'items'], itemIdx, 'name', e.target.value)}
                              placeholder="Tên chợ..."
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 focus:outline-none focus:border-[#b85233]"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-zinc-500 font-semibold">Đặc sản / Tóm tắt:</label>
                            <input 
                              type="text"
                              value={getShoppingValue(itemIdx, 'sub')}
                              onChange={(e) => updateOverrideListValue(['shopping', 'items'], itemIdx, 'sub', e.target.value)}
                              placeholder="Sản phẩm tiêu biểu..."
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 focus:outline-none focus:border-[#b85233]"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-zinc-500 font-semibold">Mô tả không khí chợ chi tiết:</label>
                          <textarea 
                            value={getShoppingValue(itemIdx, 'desc')}
                            onChange={(e) => updateOverrideListValue(['shopping', 'items'], itemIdx, 'desc', e.target.value)}
                            placeholder="Mô tả mua sắm chi tiết..."
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 min-h-[60px] focus:outline-none focus:border-[#b85233]"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-zinc-500 font-semibold">Địa chỉ:</label>
                            <input 
                              type="text"
                              value={getShoppingValue(itemIdx, 'addr')}
                              onChange={(e) => updateOverrideListValue(['shopping', 'items'], itemIdx, 'addr', e.target.value)}
                              placeholder="Địa chỉ..."
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 focus:outline-none focus:border-[#b85233]"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-zinc-500 font-semibold">Giờ mở cửa:</label>
                            <input 
                              type="text"
                              value={getShoppingValue(itemIdx, 'hours')}
                              onChange={(e) => updateOverrideListValue(['shopping', 'items'], itemIdx, 'hours', e.target.value)}
                              placeholder="Giờ mở..."
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 focus:outline-none focus:border-[#b85233]"
                            />
                          </div>
                        </div>

                        {/* Assign Media URLs for each Shopping item */}
                        <div className="pt-2 border-t border-zinc-900 space-y-2">
                          <span className="text-[9px] uppercase tracking-wide font-bold text-zinc-500">Gán Media Cho Chợ:</span>
                          
                          <div className="grid grid-cols-2 gap-2 text-[10px]">
                            <div className="space-y-1">
                              <label className="text-zinc-400">Hình ảnh URL:</label>
                              <input 
                                type="text"
                                value={currentCustom.img || defaultMediaItem.img}
                                onChange={(e) => assignMediaToPlace(placeId, 'img', e.target.value)}
                                placeholder="Gán link ảnh..."
                                className="w-full bg-zinc-900 border border-zinc-800 rounded p-1 text-[9px] focus:outline-none text-zinc-300"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-zinc-400">Video URL (Loops):</label>
                              <input 
                                type="text"
                                value={currentCustom.video || defaultMediaItem.video}
                                onChange={(e) => assignMediaToPlace(placeId, 'video', e.target.value)}
                                placeholder="Gán link video..."
                                className="w-full bg-zinc-900 border border-zinc-800 rounded p-1 text-[9px] focus:outline-none text-zinc-300"
                              />
                            </div>
                          </div>
                          {(currentCustom.img || currentCustom.video) && (
                            <button 
                              type="button" 
                              onClick={() => clearPlaceMedia(placeId)}
                              className="text-[8.5px] text-red-400 hover:underline cursor-pointer block mt-1"
                            >
                              Xóa thiết lập media tùy chỉnh (Khôi phục mặc định)
                            </button>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

              {/* SECTION: PRODUCTS (trà Lục Lam) */}
              {selectedSection === 'products' && (
                <div className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-zinc-400 font-medium">Tiêu đề khối sản phẩm:</label>
                    <input
                      type="text"
                      value={
                        (overrides as any)[activeLang]?.luclam?.menuHeading
                          ?? (translations[activeLang] as any)?.luclam?.menuHeading
                          ?? ''
                      }
                      onChange={(e) => updateOverrideValue(['luclam', 'menuHeading'], e.target.value)}
                      placeholder="Sản phẩm trứ danh..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 focus:outline-none focus:border-[#b85233]"
                    />
                  </div>

                  <span className="block border-t border-zinc-800 pt-2 text-[10px] font-bold text-zinc-400 uppercase">
                    Danh sách sản phẩm ({(translations[activeLang] as any)?.luclam?.menuItems?.length || 0} sản phẩm):
                  </span>

                  {((translations[activeLang] as any)?.luclam?.menuItems || []).map(
                    (item: any, itemIdx: number) => {
                      const placeId = `luclam-${itemIdx}`;
                      const currentCustom = customMedia[placeId] || { img: '', video: '' };

                      return (
                        <div
                          key={itemIdx}
                          id={`edit-place-${placeId}`}
                          className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-3"
                        >
                          <span className="text-[10px] font-bold text-amber-500 font-mono">
                            Sản phẩm #{itemIdx + 1} ({getProductValue(itemIdx, 'name') || item.name})
                          </span>

                          <div className="space-y-1">
                            <label className="text-zinc-500 font-semibold">Tên sản phẩm:</label>
                            <input
                              type="text"
                              value={getProductValue(itemIdx, 'name')}
                              onChange={(e) =>
                                updateOverrideListValue(['luclam', 'menuItems'], itemIdx, 'name', e.target.value)
                              }
                              placeholder="Tên dòng trà..."
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 focus:outline-none focus:border-[#b85233]"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-zinc-500 font-semibold">Mô tả:</label>
                            <textarea
                              value={getProductValue(itemIdx, 'desc')}
                              onChange={(e) =>
                                updateOverrideListValue(['luclam', 'menuItems'], itemIdx, 'desc', e.target.value)
                              }
                              placeholder="Thành phần, hương vị, công dụng..."
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 min-h-[60px] focus:outline-none focus:border-[#b85233]"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-zinc-500 font-semibold">Giá:</label>
                            <input
                              type="text"
                              value={getProductValue(itemIdx, 'price')}
                              onChange={(e) =>
                                updateOverrideListValue(['luclam', 'menuItems'], itemIdx, 'price', e.target.value)
                              }
                              placeholder="155,000 VND"
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 focus:outline-none focus:border-[#b85233]"
                            />
                            <p className="text-[8.5px] text-zinc-500 leading-normal">
                              Giữ đúng dạng <span className="font-mono text-zinc-400">155,000 VND</span>. Con số này
                              được công bố ra Google và trợ lý AI qua structured data, nên sai là sai công khai.
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-2 border-t border-zinc-800/70 pt-2.5">
                            <div className="space-y-1">
                              <label className="text-zinc-400 text-[10px]">Link mua tại Lục Lam:</label>
                              <input
                                type="text"
                                value={getProductValue(itemIdx, 'buyLuclam')}
                                onChange={(e) =>
                                  updateOverrideListValue(['luclam', 'menuItems'], itemIdx, 'buyLuclam', e.target.value)
                                }
                                placeholder="https://luclam.vn/..."
                                className="w-full bg-zinc-900 border border-zinc-800 rounded p-1 text-[9px] focus:outline-none text-zinc-300"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-zinc-400 text-[10px]">Link mua tại Takashimaya:</label>
                              <input
                                type="text"
                                value={getProductValue(itemIdx, 'buyTaka')}
                                onChange={(e) =>
                                  updateOverrideListValue(['luclam', 'menuItems'], itemIdx, 'buyTaka', e.target.value)
                                }
                                placeholder="https://online.takashimaya-vn.com/..."
                                className="w-full bg-zinc-900 border border-zinc-800 rounded p-1 text-[9px] focus:outline-none text-zinc-300"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 border-t border-zinc-800/70 pt-2.5">
                            <div className="space-y-1">
                              <label className="text-zinc-400 text-[10px]">Ảnh sản phẩm:</label>
                              <input
                                type="text"
                                value={currentCustom.img || item.image || ''}
                                onChange={(e) => assignMediaToPlace(placeId, 'img', e.target.value)}
                                placeholder="Gán link ảnh..."
                                className="w-full bg-zinc-900 border border-zinc-800 rounded p-1 text-[9px] focus:outline-none text-zinc-300"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-zinc-400 text-[10px]">Video TikTok:</label>
                              <input
                                type="text"
                                value={currentCustom.video || ''}
                                onChange={(e) => assignMediaToPlace(placeId, 'video', e.target.value)}
                                placeholder="https://www.tiktok.com/@.../video/..."
                                className="w-full bg-zinc-900 border border-zinc-800 rounded p-1 text-[9px] focus:outline-none text-zinc-300"
                              />
                            </div>
                          </div>
                          <p className="text-[8.5px] text-zinc-500 leading-normal">
                            Dán link TikTok để nút xem video hiện ra trên thẻ sản phẩm. Bỏ trống thì không có nút.
                          </p>

                          {(currentCustom.img || currentCustom.video) && (
                            <button
                              type="button"
                              onClick={() => clearPlaceMedia(placeId)}
                              className="text-[8.5px] text-red-400 hover:underline cursor-pointer block"
                            >
                              Xóa ảnh/video tùy chỉnh (khôi phục mặc định)
                            </button>
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
              )}

            </div>

            {/* Config Export and Import Panel */}
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4 space-y-3.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-[#b85233]" />
                <span>Xuất Bản & Khôi Phục Dữ Liệu</span>
              </h4>
              <p className="text-[10px] text-zinc-400 leading-normal font-light">
                Mọi nội dung chỉnh sửa của bạn được lưu tự động trên trình duyệt này. Khi hoàn thiện, bạn có thể Tải file cấu hình JSON này về để lưu trữ hoặc nộp bản thiết kế.
              </p>
              
              <div className="flex gap-2">
                <button
                  onClick={handleExportConfig}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] font-bold py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <FileCode className="w-4 h-4" />
                  Tải JSON Cấu Hình
                </button>
                <button
                  onClick={handleResetToDefaults}
                  className="bg-red-950/30 hover:bg-red-900/40 text-red-400 text-[11px] font-bold px-3 py-2.5 rounded-xl border border-red-950 transition-all cursor-pointer"
                  title="Xóa toàn bộ chỉnh sửa, khôi phục mặc định"
                >
                  Khôi Phục Mặc Định
                </button>
              </div>

              {onDeactivateCreator && (
                <button
                  onClick={onDeactivateCreator}
                  className="w-full bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-300 text-[10px] font-semibold py-2 rounded-xl border border-zinc-850 transition-all cursor-pointer block text-center"
                >
                  🔒 Tắt chế độ Creator trên thiết bị này
                </button>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
