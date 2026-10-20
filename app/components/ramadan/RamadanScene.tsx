import {TwinklingStars} from './Stars';
import {SwingingLantern} from './SwingingLantern';
import {GlowingCrescent} from './Crescent';
import {MosqueSkyline} from './Skyline';
import {RisingSparkles} from './Sparkles';

/**
 * The animated night sky behind Ramadan heroes. Sits behind the hero's
 * content; the hero needs position: relative and overflow: hidden.
 */
export function RamadanScene({
  seed = 11,
  lanterns = 3,
  skyline = true,
  moon = true,
}: {
  seed?: number;
  lanterns?: 0 | 1 | 2 | 3;
  skyline?: boolean;
  moon?: boolean;
}) {
  return (
    <>
      <TwinklingStars count={40} seed={seed} />
      {moon && <GlowingCrescent className="ramadan-scene__moon" delay={0.2} />}
      {lanterns >= 1 && <SwingingLantern className="ramadan-scene__lantern ramadan-scene__lantern--a" delay={0.1} />}
      {lanterns >= 2 && (
        <SwingingLantern className="ramadan-scene__lantern ramadan-scene__lantern--b" delay={0.5} size={0.7} />
      )}
      {lanterns >= 3 && (
        <SwingingLantern className="ramadan-scene__lantern ramadan-scene__lantern--c" delay={0.9} size={0.55} />
      )}
      <RisingSparkles seed={seed + 10} />
      {skyline && <MosqueSkyline />}
    </>
  );
}
