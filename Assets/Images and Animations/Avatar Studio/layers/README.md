# Avatar Studio Layers

This folder will hold production-ready transparent avatar parts.

Do not export flattened model-sheet crops here. Each part should use the shared production canvas from `docs/avatar-production-plan.md`:

- master canvas: `1024 x 1536`
- transparent PNG or WebP
- consistent baseline and anchor points
- no sheet background
- no crop edges

## First Base Folders

Create the first production layers under:

- `ecc-boy-base-neutral/`
- `ecc-girl-base-neutral/`

Each base should use these slot folders:

- `body/`
- `head/`
- `hair/`
- `face/`
- `uniform/`
- `arms/`
- `legs/`
- `shoes/`
- `accessories/`

The slot names must match `modules/avatar/avatar-parts.js` so Avatar Studio and Remotion can share the same rig definition.

