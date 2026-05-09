import HeroSection from "./HeroSection";
import GallerySection from "./GallerySection";
import FooterSection from "./FooterSection";

interface ExhibitionPageProps {
  onEnterLobby: () => void;
}

export default function ExhibitionPage({ onEnterLobby }: ExhibitionPageProps) {
  return (
    <div className="bg-xuan-warm">
      {/* Hero — 艺术漫游主视觉 */}
      <HeroSection onStart={onEnterLobby} />

      {/* Gallery — 艺境巡礼 */}
      <GallerySection />

      {/* Navigation buttons */}
      <div className="flex justify-center gap-6 pb-16 px-4">
        <button
          onClick={onEnterLobby}
          className="px-8 py-3 bg-cinnabar text-white rounded-btn text-base tracking-wider seal-btn flex items-center gap-2 hover:bg-cinnabar/90 transition-all shadow-seal"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
            <polyline points="10 17 15 12 10 7"/>
            <line x1="15" y1="12" x2="3" y2="12"/>
          </svg>
          进入教室大厅
        </button>
      </div>

      {/* Footer */}
      <FooterSection />
    </div>
  );
}
