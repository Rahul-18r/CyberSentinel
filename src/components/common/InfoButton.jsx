import { FaInfoCircle } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

const InfoButton = ({ id, content }) => {
  return (
    <>
      <button
        className="info-button text-indigo-400 hover:text-indigo-300 transition-colors"
        data-tooltip-id={id}
        data-tooltip-content={content}
      >
        <FaInfoCircle size={20} />
      </button>
      <Tooltip id={id} place="top" effect="solid" className="max-w-md" />
    </>
  );
};

export default InfoButton;