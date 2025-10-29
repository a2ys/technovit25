"use client";

import FaultyTerminal from "@/components/FaultyTerminal";
import ImageCarousel from "@/components/ImageCarousel";
import EventsPage from "@/components/EventsPage";
import { useEffect, useState, useMemo } from "react";
import { Asset, EventItem } from "@/interfaces/contentful";
import { getAssetUrl } from "../utils/assetUrl";
import { getCachedEventsData } from "../utils/apiCache";

const Events = () => {
  const [eventData, setEvents] = useState<EventItem[]>([]);
  const [assetData, setAssetData] = useState<Asset[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const responseData = await getCachedEventsData(
          "https://cdn.a2ys.dev/events.json"
        );

        const sortedEvents = responseData.items.sort((a, b) =>
          a.fields.eventName.localeCompare(b.fields.eventName)
        );

        setEvents(sortedEvents);
        setAssetData(responseData.includes?.Asset || []);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };
    fetchEvents();
  }, []);

  const carouselImages = useMemo(() => {
    return eventData
      .filter((event) => event.fields.specialEvent === true)
      .map((event) => {
        const assetId = event.fields.poster?.sys?.id;
        const asset = assetData.find((a) => a.sys.id === assetId);
        const url = asset?.fields?.file?.url;

        return getAssetUrl(url);
      })
      .filter((url): url is string => url !== null);
  }, [eventData, assetData]);

  return (
    <div>
      <div className="w-full h-[90vh] bg-black overflow-hidden relative">
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
            tint="#70E081"
            mouseReact={true}
            mouseStrength={0.6}
            pageLoadAnimation={false}
            brightness={0.5}
          />
        </div>

        <div className="relative overflow-hidden bg-[#70E081] ttFont py-1">
          <div className="flex whitespace-nowrap animate-marquee hover:pause">
            {Array(2)
              .fill(0)
              .map((_, i) => (
                <div className="flex" key={i}>
                  <span className="text-black text-lg font-medium inline-block">
                    For any event related queries e-mail us at{" "}
                    <a href="mailto:technovit@vit.ac.in">technovit@vit.ac.in</a>
                  </span>
                  <span className="text-black text-lg font-medium mx-8 inline-block">
                    For any event related queries mail{" "}
                    <a href="mailto:technovit@vit.ac.in">technovit@vit.ac.in</a>
                  </span>
                  <span className="text-black text-lg font-medium mx-8 inline-block">
                    For any event related queries mail{" "}
                    <a href="mailto:technovit@vit.ac.in">technovit@vit.ac.in</a>
                  </span>
                </div>
              ))}
          </div>
          <style>
            {`
              @keyframes marquee {
                0% { transform: translateX(0%); }
                100% { transform: translateX(-50%); }
              }
              .animate-marquee { animation: marquee 60s linear infinite; }
              .hover\\:pause:hover { animation-play-state: paused; }
            `}
          </style>
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
          <ImageCarousel images={carouselImages} autoPlayInterval={2500} />
        </div>
      </div>
      <div className="flex flex-col md:flex-row">
        <div className="flex-1 overflow-y-auto">
          <EventsPage eventData={eventData} assetData={assetData} />
        </div>
      </div>
    </div>
  );
};

export default Events;
