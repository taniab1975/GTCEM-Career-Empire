# Avatar Studio Roadmap

Avatar Studio should become the persistent identity layer for Career Empire. The first version is deliberately small: students create a personalised avatar, name a future occupation interest, and save a profile that can later feed career-plan, interview, training, and shop systems.

## Asset Strategy

The avatar house style should follow the existing ECC animated guide characters rather than a flat generic cartoon. The strongest references are:

- `Assets/ECC Branding/ECC_priority_style_reference_sheet.jpg`
- `Assets/ECC Branding/ECC_style_source_contact_sheet.jpg`
- `Assets/Images and Animations/Student Hub/student-hub-guide.gif`
- `Assets/Images and Animations/Emmanuel Student Characters/MacKillop/`
- `Assets/Images and Animations/Emmanuel Student Characters/Romero/`

Visual traits to preserve:

- soft 3D student-guide rendering
- expressive oversized eyes and warm faces
- navy uniform, teal tie, gold crest/button accents
- clean transparent character cutouts for UI scenes
- holographic cyan/purple/gold UI frames around the character
- dark ECC "future studio" framing around the preview, with lighter picker panels only where students need to compare options
- friendly guide poses such as welcome, thinking, pointing, encouraging, and celebrating

Start with code-native layered SVG assets. They are fast to build, remixable, licence-safe, and easy to recolour without generating hundreds of images. The MVP SVG should imitate the ECC guide proportions and colour language as a placeholder until generated modular art is stable.

Use generated transparent PNG/WebP asset packs later for polish once the slots are stable:

- hair packs: short, waves, curls, long, bun, wraps, protective styles, colour variants
- face packs: face shapes, eyes, expressions, freckles, glasses
- outfit packs: interview, school, workwear, scrubs, hi-vis, hospitality, creative, business
- accessory packs: earrings, headphones, lanyards, name badges, watches, bags
- shop packs: jewellery, shoes, phones, laptops, cars, rooms, tools, career gear

Generation can happen in Codex using image generation, then final project assets should be copied into `Assets/Images and Animations/Avatar Studio/` with clear slot names. For modular avatars, every generated piece should use the same transparent canvas size, camera angle, lighting, and anchor points.

Suggested generation prompt base:

```text
Create a friendly soft-3D animated student guide character asset for Career Empire, matching the existing ECC guide style: expressive oversized eyes, warm rounded face, polished navy school blazer, teal tie, gold crest/button accents, clean classroom-game lighting, transparent-background-ready full-body/half-body pose, no text, no watermark. Keep the pose, camera angle, canvas size, and lighting consistent across all variants.
```

## Stage 1: MVP Creator

- Create `modules/avatar/` as a playable avatar creator.
- Save selections locally under `career-empire-avatar-v1`.
- Store the latest avatar on the shared `career-empire-session` object.
- Include face, skin tone, hair, hair colour, outfit, accessory, and a future-self card.
- Add Avatar Studio to the Student Hub and dashboard module controls.
- Add a smoke test for page load.

## Stage 2: Profile And Evidence

- Store avatar profile in Supabase for logged-in students.
- Create teacher-visible evidence for occupation interest, training idea, and employability strength.
- Show avatar preview on the student dashboard.
- Add teacher dashboard drill-down fields for future-self profile and avatar completion.

## Stage 3: Shop Integration

- Add avatar categories to the Global Shop.
- Separate free starter wardrobe from earned unlocks.
- Connect purchases to avatar slots such as accessory, outfit, room, vehicle, and career gear.
- Add teacher-reviewed student item requests for avatar items.

## Stage 4: Career Plan Module Link

- Expand the future-self card into occupation, pathway, training, barriers, interview outfit, and preparation goals.
- Add decision points with trade-offs around money, training time, transport, wellbeing, and opportunity.
- Save career-plan evidence for teacher review.

## Stage 5: Identity Across The Ecosystem

- Render the avatar on dashboard profile surfaces, module intros, leaderboards, shop inventory, and certificates.
- Let students earn badges and visual upgrades from EST Prep, Lifelong Learning, Megatrends, and later modules.
- Keep the avatar tied to evidence and decisions so it remains gameplay, not decoration.

## Design Guardrails

- Keep the asset set inclusive and school-safe.
- Avoid ranking physical features or implying one look is better.
- Make unlocks include career gear and life goals, not only luxury items.
- Keep spending choices connected to trade-offs, savings, and long-term goals.
- Treat the avatar as a future-self identity, not a vanity-only wardrobe.
