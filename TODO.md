# Fix Next.js Heap Memory Error - TODO List

## Plan Overview
Fix FATAL ERROR: Reached heap limit during `pnpm run dev` on pages /, /lien-he, /quan-ly.

**Status: [IN PROGRESS]**

## Steps
✅ 1. Updated package.json: Heap size 8GB.
✅ 2. next.config.mjs: Turbopack disabled (already present).
✅ 3. Fixed circular import in app/quan-ly/manager-content.tsx → No more infinite loop.
✅ 4. Cleared .next cache.
- [ ] 3. Clear .next cache: rmdir /s .next && run dev.
- [ ] 4. Read & analyze app/quan-ly/manager-content.tsx for memory issues (large fetches, loops).
- [ ] 5. Add pagination/lazy loading to manager dashboard if fetching all data.
- [ ] 6. Add revalidate/cache to lib fetch functions.
- [ ] 7. Test: Run dev, access /quan-ly, /lien-he, /.
- [ ] 8. attempt_completion.

**Completed:** None yet.
