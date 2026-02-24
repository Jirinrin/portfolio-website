import { useEffect, useState } from 'react';

import './ServiceBubbles.scss';

function ServiceBubbles() {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const vh = window.innerHeight;
      const fadeStart = vh * 0.1;
      const fadeEnd = vh * 0.4;
      setOpacity(Math.min(1, Math.max(0, (window.scrollY - fadeStart) / (fadeEnd - fadeStart))));
    };

    handleScroll(); // set initial value
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="ServiceBubbles">
      <div className="service-bubbles" style={{ opacity }}>
        <a className="service-bubble float-a" href="https://kinoko.nosk.be" target="_blank" rel="noopener noreferrer">
          <span className="bubble-title">LOOK WITHIN</span>
          <span className="bubble-sub">Sacred Mushroom Journeys, guided by a soul who cares</span>
        </a>
        {/* <a className="service-bubble float-b" href="#" target="_blank" rel="noopener noreferrer">
          <span className="bubble-title">Sample Service</span>
          <span className="bubble-sub">sample description</span>
        </a> */}
      </div>
    </div>
  );
}

export default ServiceBubbles;
