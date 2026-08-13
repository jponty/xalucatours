import { ROUTES } from "./routes";
import {
  AVAILABLE_PROGRAM_AUDIO_PATHS,
  programAudioFilenameForPath,
  programAudioGuideForPath,
  programAudioGuideForRoute,
} from "./programAudioGuides";

describe("program audio guide registry", () => {
  test("contains exactly the 58 storage objects verified in Supabase", () => {
    expect(AVAILABLE_PROGRAM_AUDIO_PATHS).toHaveLength(58);
    expect(new Set(AVAILABLE_PROGRAM_AUDIO_PATHS).size).toBe(58);
  });

  test("every registered path belongs to a real Spanish programme route", () => {
    const projectPaths = new Set(
      Object.values(ROUTES)
        .map((route) => route.es)
        .filter(Boolean)
        .map((slug) => `/${slug}`)
    );

    AVAILABLE_PROGRAM_AUDIO_PATHS.forEach((path) => {
      expect(projectPaths.has(path)).toBe(true);
    });
  });

  test("builds the exact uploaded ElevenLabs object name", () => {
    const path = "/viajes/desierto_atlas/programa_4n_5d";
    expect(programAudioFilenameForPath(path)).toBe(
      "ElevenLabs_https_xaluca-tours-web_onrender_com_viajes_desierto_atlas_programa_4n_5d.mp3"
    );
    expect(programAudioGuideForPath(path)).toContain(
      "/xaluca-audioguides/ElevenLabs_https_xaluca-tours-web_onrender_com_viajes_desierto_atlas_programa_4n_5d.mp3"
    );
  });

  test("returns no player source for missing or untranslated narrations", () => {
    expect(programAudioGuideForPath("/viajes/marrakech_essaouira/programa_4n_5d")).toBeNull();
    expect(programAudioGuideForRoute("tourDesiertoAtlas45", "en")).toBeNull();
    expect(programAudioGuideForRoute("tourDesiertoAtlas45", "es")).toBeTruthy();
  });
});
