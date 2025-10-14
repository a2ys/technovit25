import FaultyTerminal from "./FaultyTerminal";
import ImageCarousel from "./ImageCarousel";
import EventsPage from "./EventsPage";

const Events = () => {
  return (
    <div>
      <div className="w-full h-[90vh] bg-black overflow-hidden relative">
        {/* Background effect */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <FaultyTerminal
            scale={3}
            gridMul={[2, 1]}
            digitSize={1.2}
            timeScale={0.5}
            pause={false}
            scanlineIntensity={0.2}
            glitchAmount={0.8}
            flickerAmount={0.3}
            noiseAmp={0.8}
            chromaticAberration={0}
            dither={0}
            curvature={0}
            tint="#00ff00"
            mouseReact={true}
            mouseStrength={0.6}
            pageLoadAnimation={false}
            brightness={0.5}
          />
        </div>

        <div className="relative z-10 w-full min-h-screen flex flex-col lg:flex-row items-center justify-center lg:justify-around px-4 sm:px-6 md:px-12 lg:px-24 py-8 md:py-0 gap-8 lg:gap-0 ttFont">
          <div className="flex flex-col space-y-2 sm:space-y-3 text-center lg:text-left">
            <h1 className="text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[110px] leading-none tracking-tight">
              Events
            </h1>
            <p className="text-white text-lg sm:text-xl md:text-2xl font-light">
              @ technoVIT&apos;25
            </p>
          </div>

          <ImageCarousel />
        </div>
      </div>
      <div className="flex flex-col md:flex-row">
        <div className="flex-1 overflow-y-auto">
          <EventsPage />
        </div>
      </div>
    </div>
  );
};

export default Events;
