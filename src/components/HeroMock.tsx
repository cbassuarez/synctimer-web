import { motion, useReducedMotion } from 'framer-motion';

const chips = ['Locked', 'Host 1', 'Wi-Fi', 'MTC'];
const tiles = ['Room 12A', 'Break', 'Preset 04', 'Sync drift 0.0 ms', 'Cue sheet 03'];

export default function HeroMock() {
  const reduced = useReducedMotion();
  const chipMotion = reduced
    ? {}
    : {
        animate: { y: [0, -6, 0] },
        transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
      };

  const tileMotion = reduced
    ? {}
    : {
        animate: { y: [0, 8, 0] },
        transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
      };

  return (
    <div className="hero-mock">
      <div className="mock-card">
        <div className="mock-header">
          <span className="mock-label">SyncTimer</span>
          <span className="mock-status">Phase locked</span>
        </div>
        <div className="mock-timer">00:03:17</div>
        <div className="mock-sub">Countdown · next cue at 00:02:45</div>
        <div className="mock-chip-row">
          {chips.map((chip) => (
            <motion.span key={chip} className="chip" {...chipMotion}>
              {chip}
            </motion.span>
          ))}
        </div>
      </div>
      <div className="mock-tiles">
        {tiles.map((tile) => (
          <motion.div key={tile} className="mock-tile" {...tileMotion}>
            {tile}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
