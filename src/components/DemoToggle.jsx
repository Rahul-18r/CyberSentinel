import { RiTestTubeFill, RiShieldKeyholeFill } from 'react-icons/ri';

const DemoToggle = ({ isDemoMode, setIsDemoMode, playHover, playClick }) => {
  return (
    <div className="demo-toggle">
      <button
        className={`mode-toggle ${isDemoMode ? 'demo' : 'real'}`}
        onClick={() => {
          playClick();
          setIsDemoMode(!isDemoMode);
        }}
        onMouseEnter={() => playHover()}
      >
        {isDemoMode ? (
          <>
            <RiTestTubeFill className="mode-icon" />
            <span>Demo Mode</span>
          </>
        ) : (
          <>
            <RiShieldKeyholeFill className="mode-icon" />
            <span>Real Mode</span>
          </>
        )}
      </button>
    </div>
  );
};

export default DemoToggle;