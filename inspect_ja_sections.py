with open("src/translations.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Let's see the structure under ja:
ja_pos = content.find("ja: {")
if ja_pos != -1:
    # Print the first 2000 characters
    print("--- ja block preview ---")
    print(content[ja_pos:ja_pos+1000])

    # Let's search for "shopping:" after the pages block
    pages_pos = content.find("pages:", ja_pos)
    if pages_pos != -1:
        # Let's find "shopping:" relative to pages_pos
        shop_pos = content.find("shopping:", pages_pos)
        print(f"\n--- shopping at {shop_pos} ---")
        print(content[shop_pos:shop_pos+200])

        # Let's find "culture:" after the pages block ends
        # pages ends after shopping, and there is a culture: block below pages block
        culture_below_pos = content.find("culture:", shop_pos)
        print(f"\n--- culture below shopping at {culture_below_pos} ---")
        print(content[culture_below_pos:culture_below_pos+500])
