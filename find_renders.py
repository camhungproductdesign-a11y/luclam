with open("src/App.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if "restaurants" in line or "food.categories" in line or "stay.categories" in line:
        print(f"Line {idx+1}: {line.strip()}")
        # print surrounding lines
        start = max(0, idx - 4)
        end = min(len(lines), idx + 8)
        for j in range(start, end):
            print(f"  [{j+1}] {lines[j].rstrip()}")
        print("-" * 50)
