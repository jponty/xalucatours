import { galleryReadKeys, resolveManagedGallery, resolveImageSlot } from './galleryCompatibility';
import { namespaceForRouteId } from '@/components/slotScope';
import { ROUTES, resolvePath, pathFor } from './routes';

jest.mock('react-router-dom', () => ({ useLocation: () => ({ pathname: '/' }) }));
const short = 'viajes.aventura.enduro.programa_3n_4d';
const long = 'viajes.aventura.enduro.programa_4n_5d';
const key = (ns, day) => `${ns}.day.${day}.dia-${day}`;

test.each([[1, 1], [2, 2], [3, 4], [4, 5]])('new day %s inherits equivalent day %s, not the retired itinerary', (day, source) => {
  const images = [{ url: `/stage-${source}.jpg` }];
  const docs = { [key(long, source)]: images };
  expect(resolveManagedGallery(key(short, day), k => docs[k])).toEqual({ key: key(long, source), images });
  expect(galleryReadKeys(key(short, day)).join(' ')).not.toContain('6n_7d');
  docs[key(short, day)] = [{url:'/new.jpg'}];
  expect(resolveManagedGallery(key(short, day), k => docs[k]).images).toBe(docs[key(short, day)]);
  docs[key(short, day)] = [];
  expect(resolveManagedGallery(key(short, day), k => docs[k]).images).toEqual([]);
});

test('legacy galleries still work and unrelated routes are unchanged', () => {
  const docs = { [`${short}.day.dia-3`]: [{url:'/legacy.jpg'}] };
  expect(resolveManagedGallery(key(short, 3), k => docs[k]).images[0].url).toBe('/legacy.jpg');
  expect(galleryReadKeys('viajes.other.day.2.repeat')).toEqual(['viajes.other.day.2.repeat', 'viajes.other.day.repeat']);
});

test('ES, EN and FR use the same namespace and only current programmes are listed', () => {
  for (const lang of ['es', 'en', 'fr']) {
    const route = resolvePath(pathFor(lang, 'tourEnduroAventura34'));
    expect(namespaceForRouteId(route.routeId)).toBe(short);
  }
  expect(ROUTES.tourEnduroAventura67).toBeUndefined();
});

test('preserves the existing master photo without overriding a new or cleared image', () => {
  const target = 'trip.tourEnduroAventura34.hero';
  const docs = { 'trip.tourEnduroAventura67.hero': {url:'/existing.jpg'} };
  expect(resolveImageSlot(target, k => docs[k])).toEqual({url:'/existing.jpg'});
  docs[target] = {url:'/new.jpg'};
  expect(resolveImageSlot(target, k => docs[k])).toEqual({url:'/new.jpg'});
  docs[target] = {cleared:true,url:null};
  expect(resolveImageSlot(target, k => docs[k]).cleared).toBe(true);
});
