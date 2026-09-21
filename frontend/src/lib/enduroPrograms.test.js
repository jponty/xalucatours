import { PROGRAM_ENDURO_34 } from './programs/enduroAventura34';
import { PROGRAM_ENDURO_45 } from './programs/enduroAventura45';
import { TRIP_PROGRAMS } from './tripPrograms';
import { ALL_TRIPS } from './allTripsCatalog';
import { HUB_AVENTURA_ENDURO, COMMON_NIGHTS } from './itineraryHubs';
import { pathFor, redirectForPath } from './routes';
import { getProgramTiers, getProgramExtras } from './programPricing';
import { tripFromPrice } from './tripFinder';
import { getTripPackingNotes } from './tripPackingNotes';
import { deriveTripRoute } from './deriveTripRoute';
import { getDayTravelNotes } from './dayTravelNotes';

describe('approved enduro programmes', () => {
  test('publishes only the two supplied durations', () => {
    expect(Object.keys(TRIP_PROGRAMS).filter(id => id.includes('Enduro')).sort()).toEqual(['tourEnduroAventura34', 'tourEnduroAventura45']);
    expect(ALL_TRIPS.filter(t => t.routeId.includes('Enduro')).map(t => t.nights).sort()).toEqual([3, 4]);
    expect(JSON.stringify(HUB_AVENTURA_ENDURO)).not.toMatch(/6n_7d|6 noches|7 días/);
    expect(COMMON_NIGHTS['3n4d'].es).toBe('3 noches · 4 días');
  });

  test.each([[PROGRAM_ENDURO_34, 3, 2], [PROGRAM_ENDURO_45, 4, 3]])('keeps itinerary, services and price suppression consistent', (program, nights, ridingDays) => {
    expect(program.days).toHaveLength(nights + 1);
    expect(program.ridingDays).toBe(ridingDays);
    expect(program.hidePrices).toBe(true);
    for (const lang of ['es', 'en', 'fr']) {
      expect(pathFor(lang, program.routeId)).not.toBe('/');
      expect(program.meta[lang].description.length).toBeGreaterThan(0);
      program.days.forEach(day => expect(day.body[lang]).toBeTruthy());
      expect(program.details.includes[lang]).toHaveLength(7);
      expect(program.details.excludes[lang]).toHaveLength(7);
    }
    expect(program.days[0].body.es).toContain('23:59');
    expect(program.days[nights].body.es).toContain('07:15');
    expect(program.days[nights - 1].body.es).toContain('4x4');
    expect(program.days[nights - 1].body.es).toContain('Pizzeria Des Dunes');
    expect(program.days[nights - 2].body.es).toContain('bivouac');
    expect(program.details.excludes.es.join(' ')).toContain('Seguro de la actividad');
    expect(JSON.stringify(program)).not.toMatch(/€|\bEUR\b|3990|Jorf|Voth|Saghro/);
    expect(getProgramTiers(program.routeId)).toEqual([]);
    expect(getProgramExtras(program.routeId)).toBeNull();
    expect(tripFromPrice(program.routeId, { tiers: [{low: 999, high: 1200}] })).toBeNull();
    expect(JSON.stringify(getTripPackingNotes(program.routeId))).toContain('casco integral');
    expect(JSON.stringify(deriveTripRoute(program))).not.toMatch(/Bivouac/);
    expect(deriveTripRoute(program).map(node => node.name.es)).toEqual(nights === 3
      ? ['Erfoud', 'Merzouga', 'Erfoud', 'Errachidia']
      : ['Erfoud', 'Merzouga', 'Merzouga', 'Erfoud', 'Errachidia']);
    expect(getDayTravelNotes(program.routeId, 1)).toHaveLength(1);
  });

  test('preserves old inbound links without listing a third programme', () => {
    expect(redirectForPath('/viajes/aventura/enduro/programa_6n_7d')).toBe(pathFor('es', 'tourEnduroAventura34'));
    expect(redirectForPath('/en/tours/adventure/enduro/program-6n-7d/')).toBe(pathFor('en', 'tourEnduroAventura34'));
    expect(redirectForPath('/fr/voyages/aventure/enduro/programme-6n-7j')).toBe(pathFor('fr', 'tourEnduroAventura34'));
    expect(getProgramTiers('tourAventuraEnduroHub')).toEqual([]);
  });
});
