import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import GalleryManager from './GalleryManager';
import DayImageGallery from './DayImageGallery';
import JourneyChronology from './JourneyChronology';
import { PROGRAM_ENDURO_34 } from '@/lib/programs/enduroAventura34';
import { getDayGallery } from '@/lib/dayGalleryStore';
import { toast } from 'sonner';

const mockShort = 'viajes.aventura.enduro.programa_3n_4d';
const mockLong = 'viajes.aventura.enduro.programa_4n_5d';
const mockManifest = {slots:[], galleries:[1,2,3,4,5].map(n => ({
  key:`${mockLong}.day.${n}.dia-${n}`,
  images:[{url:`https://images.test/day${n}-a.jpg`},{url:`https://images.test/day${n}-b.jpg`}],
}))};
jest.mock('@/lib/supabaseImages', () => ({loadSupabaseImages: () => Promise.resolve(mockManifest), updateManifestGallery:jest.fn()}));
jest.mock('@/components/slotScope', () => ({
  namespaceForRouteId: id => id === 'tourEnduroAventura34' ? mockShort : id === 'tourEnduroAventura45' ? mockLong : id,
  useSlotId: name => `${mockShort}.${name}`,
}));
jest.mock('@/contexts/LanguageContext', () => ({pick:(t,l) => t?.[l] || t?.es, useLanguage: () => ({lang:'es'})}));
jest.mock('@/contexts/EditModeContext', () => ({useEditMode: () => ({imageEditMode:false})}));
jest.mock('@/contexts/EditableGroupContext', () => ({EditableGroup:({children}) => children}));
jest.mock('@/components/EditableImage', () => ({__esModule:true, default: () => null, getSlotUrl: () => null, ensureSlotsLoaded: () => Promise.resolve()}));
jest.mock('@/components/Img', () => ({Img:({src,alt}) => <img src={src} alt={alt || ''} />}));
jest.mock('@/components/ImageLibraryPicker', () => () => null);
jest.mock('@/components/ImageContactBubble', () => () => null);
jest.mock('sonner', () => ({toast:{success:jest.fn(),error:jest.fn()}}));

test('admin, public day and chronology share the gallery; saves stay on the new key and failures do not publish', async () => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  const originalFetch = global.fetch;
  global.fetch = jest.fn(async (_url, options) => ({ok:true,json:async () => JSON.parse(options.body)}));
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  try {
    await act(async () => root.render(<><GalleryManager /><DayImageGallery day={PROGRAM_ENDURO_34.days[2]} dayIndex={3} dayNum="03" dayLabel="Día" /><JourneyChronology days={PROGRAM_ENDURO_34.days} variant="enduro" /></>));
    expect(container.querySelector('[data-testid="gallery-trip-tourEnduroAventura67"]')).toBeNull();
    await act(async () => container.querySelector('[data-testid="gallery-trip-tourEnduroAventura34"]').click());
    expect(container.querySelector('[data-testid="gallery-trip-open-tourEnduroAventura34"]').getAttribute('href')).toBe('/viajes/aventura/enduro/programa_3n_4d');
    expect(container.querySelectorAll('[data-testid^="gallery-day-"]')).toHaveLength(4);
    const target = `${mockShort}.day.3.dia-3`;
    const editorImage = () => container.querySelector(`[data-testid="gallery-day-${target}"] img`).getAttribute('src');
    const publicImage = () => container.querySelector('[data-testid="day-gallery-viewer-dia-3"] img').getAttribute('src');
    const chronologyImage = () => container.querySelector('[data-testid="journey-chronology-day-3"] img').getAttribute('src');
    expect(editorImage()).toBe('https://images.test/day4-a.jpg');
    expect(publicImage()).toBe(editorImage());
    expect(chronologyImage()).toBe(editorImage());
    await act(async () => container.querySelector(`[data-testid="gallery-setmain-${target}-1"]`).click());
    expect(global.fetch.mock.calls[0][0]).toContain(target);
    expect(editorImage()).toBe('https://images.test/day4-b.jpg');
    expect(publicImage()).toBe(editorImage());
    expect(chronologyImage()).toBe(editorImage());
    expect(getDayGallery(`${mockLong}.day.4.dia-4`)[0].url).toBe('https://images.test/day4-a.jpg');
    toast.success.mockClear();
    global.fetch.mockResolvedValueOnce({ok:false});
    await act(async () => container.querySelector(`[data-testid="gallery-setmain-${target}-1"]`).click());
    expect(toast.success).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalled();
    expect(editorImage()).toBe(publicImage());
  } finally {
    await act(async () => root.unmount());
    container.remove();
    global.fetch = originalFetch;
    delete global.IS_REACT_ACT_ENVIRONMENT;
  }
});
