import { loadSupabaseImages, updateManifestGallery } from './supabaseImages';

test('saved galleries survive later SPA reads without duplicating keys or refetching', async () => {
  const originalFetch = global.fetch;
  global.fetch = jest.fn(async () => ({ ok: true, json: async () => ({
    slots: [{ slot_id: 'hero', url: 'hero.jpg' }],
    galleries: [{ key: 'existing', images: [{ url: 'original.jpg' }] }],
  }) }));
  try {
    await loadSupabaseImages();
    updateManifestGallery('new-programme', [{ url: 'first.jpg' }]);
    updateManifestGallery('new-programme', [{ url: 'saved.jpg' }]);
    const manifest = await loadSupabaseImages();
    expect(manifest.galleries).toEqual([
      { key: 'existing', images: [{ url: 'original.jpg' }] },
      { key: 'new-programme', images: [{ url: 'saved.jpg' }] },
    ]);
    expect(manifest.slots).toEqual([{ slot_id: 'hero', url: 'hero.jpg' }]);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  } finally {
    global.fetch = originalFetch;
  }
});
