import { Cafe } from '@/types/cafe';
interface CafePreviewProps {
  cafe: Cafe;
  onClose: () => void;
}

const CafePreview = ({ cafe, onClose }: CafePreviewProps) => {
  return (
    <div>
      <h1>{cafe.title}</h1>
    </div>
  );
};

export default CafePreview;
