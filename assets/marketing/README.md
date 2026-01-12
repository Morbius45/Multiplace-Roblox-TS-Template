# Marketing Assets

This folder contains marketing assets for your Roblox experience, including icons and thumbnails.

## 📁 Folder Structure

```
assets/marketing/
├── icons/
│   ├── game-icon.png         # Main game icon (512x512)
│   └── game-icon-small.png   # Small icon variant (150x150)
├── thumbnails/
│   ├── experience-thumbnail-1.png   # Experience thumbnails (1920x1080)
│   ├── experience-thumbnail-2.png
│   └── experience-thumbnail-3.png
└── places/
    ├── start/
    │   ├── icon.png          # Start place icon (512x512)
    │   └── thumbnail.png     # Start place thumbnail (1920x1080)
    └── <place-name>/
        ├── icon.png
        └── thumbnail.png
```

## 📏 Asset Specifications

### Game Icon

| Property      | Value                    |
| ------------- | ------------------------ |
| Size          | 512 x 512 pixels         |
| Format        | PNG (recommended) or JPG |
| Aspect Ratio  | 1:1 (square)             |
| Max File Size | 4 MB                     |

### Experience Thumbnails

| Property      | Value                            |
| ------------- | -------------------------------- |
| Size          | 1920 x 1080 pixels (recommended) |
| Format        | PNG or JPG                       |
| Aspect Ratio  | 16:9                             |
| Max File Size | 4 MB                             |
| Quantity      | Up to 10 thumbnails              |

### Place Icons (for multiplace)

| Property     | Value             |
| ------------ | ----------------- |
| Size         | 512 x 512 pixels  |
| Format       | PNG (recommended) |
| Aspect Ratio | 1:1 (square)      |

### Place Thumbnails

| Property     | Value              |
| ------------ | ------------------ |
| Size         | 1920 x 1080 pixels |
| Format       | PNG or JPG         |
| Aspect Ratio | 16:9               |

## 🚀 Uploading to Roblox

### Method 1: Roblox Creator Dashboard (Recommended)

1. Go to [create.roblox.com](https://create.roblox.com)
2. Select your experience
3. Navigate to **Configure** → **Basic Info**
4. Upload your icon and thumbnails

### Method 2: Via Mantle (Automated)

Add icon/thumbnail configuration to your `mantle.yml`:

```yaml
target:
  experience:
    configuration:
      # Experience icon
      icon:
        file: assets/marketing/icons/game-icon.png

      # Experience thumbnails (up to 10)
      thumbnails:
        - file: assets/marketing/thumbnails/experience-thumbnail-1.png
        - file: assets/marketing/thumbnails/experience-thumbnail-2.png
        - file: assets/marketing/thumbnails/experience-thumbnail-3.png

    places:
      start:
        file: src/places/start/start.rbxlx
        configuration:
          name: "Start Place"
          # Place-specific icon (optional)
          icon:
            file: assets/marketing/places/start/icon.png
```

Then deploy:

```bash
npm run mantle:deploy
```

## 🎨 Design Tips

### Icons

- Use **bold, simple shapes** that are recognizable at small sizes
- Avoid text (it becomes unreadable when scaled down)
- Use **contrasting colors** to stand out in the games list
- Consider your target audience when choosing style

### Thumbnails

- Show **actual gameplay** or representative scenes
- Include **characters/avatars** for relatability
- Use **bright, vibrant colors**
- Add **action or movement** to create interest
- Avoid misleading imagery (violates Roblox ToS)

### Multiplace Considerations

- Keep a **consistent visual style** across all place icons
- Use **color coding** to differentiate places (e.g., blue for lobby, red for arena)
- Include the **place name or number** subtly if helpful

## 📋 Checklist Before Publishing

- [ ] Game icon is 512x512 PNG
- [ ] At least 1 experience thumbnail uploaded
- [ ] Thumbnails are 16:9 aspect ratio
- [ ] No text that's too small to read
- [ ] Images are appropriate for all ages
- [ ] No copyrighted/trademarked content
- [ ] Images accurately represent the game

## 🔗 Resources

- [Roblox Icon Guidelines](https://create.roblox.com/docs/production/publishing/publishing-experiences-and-places#experience-icon)
- [Roblox Thumbnail Guidelines](https://create.roblox.com/docs/production/publishing/publishing-experiences-and-places#experience-thumbnails)
- [Mantle Asset Configuration](https://mantledeploy.vercel.app/docs/configuration/target)
