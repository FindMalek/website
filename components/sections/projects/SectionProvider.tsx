import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { createStore, useStore, StoreApi } from "zustand";

import { remToPx } from "@/lib/utils";
import { Section } from "@/lib/types";

function createSectionStore({ sections }: { sections: Section[] }) {
  return createStore((set) => ({
    sections,
    visibleSections: [],
    setVisibleSections: (visibleSections: Section[]) =>
      set((state: any) =>
        state.visibleSections.join() === visibleSections.join()
          ? {}
          : { visibleSections }
      ),
    registerHeading: ({
      id,
      ref,
      offsetRem,
    }: {
      id: string;
      ref: any;
      offsetRem: number;
    }) =>
      set((state: any) => {
        return {
          sections: state.sections.map((section: Section) => {
            if (section.id === id) {
              return {
                ...section,
                headingRef: ref,
                offsetRem,
              };
            }
            return section;
          }),
        };
      }),
  }));
}

function useVisibleSections({ sectionStore }: { sectionStore: any }) {
  let setVisibleSections = useStore(
    sectionStore,
    (s: any) => s.setVisibleSections
  );
  let sections = useStore(sectionStore, (s: any) => s.sections);

  useEffect(() => {
    function checkVisibleSections() {
      let { innerHeight, scrollY } = window;
      let newVisibleSections = [];

      for (
        let sectionIndex = 0;
        sectionIndex < sections?.length;
        sectionIndex++
      ) {
        let { id, headingRef, offsetRem } = sections[sectionIndex];
        let offset = remToPx(offsetRem);
        let top = headingRef.current.getBoundingClientRect().top + scrollY;

        if (sectionIndex === 0 && top - offset > scrollY) {
          newVisibleSections.push("_top");
        }

        let nextSection = sections[sectionIndex + 1];
        let bottom =
          (nextSection?.headingRef.current.getBoundingClientRect().top ??
            Infinity) +
          scrollY -
          remToPx(nextSection?.offsetRem ?? 0);

        if (
          (top > scrollY && top < scrollY + innerHeight) ||
          (bottom > scrollY && bottom < scrollY + innerHeight) ||
          (top <= scrollY && bottom >= scrollY + innerHeight)
        ) {
          newVisibleSections.push(id);
        }
      }

      setVisibleSections(newVisibleSections);
    }

    let raf = window.requestAnimationFrame(() => checkVisibleSections());
    window.addEventListener("scroll", checkVisibleSections, { passive: true });
    window.addEventListener("resize", checkVisibleSections);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", checkVisibleSections);
      window.removeEventListener("resize", checkVisibleSections);
    };
  }, [setVisibleSections, sections]);
}

const SectionStoreContext = createContext<StoreApi<unknown> | null>(null);
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export function SectionProvider({
  sections,
  children,
}: {
  sections: Section[];
  children: any;
}) {
  let [sectionStore] = useState(() => createSectionStore({ sections }));

  useVisibleSections({ sectionStore });

  useIsomorphicLayoutEffect(() => {
    sectionStore.setState({ sections });
  }, [sectionStore, sections]);

  return (
    <SectionStoreContext.Provider value={sectionStore}>
      {children}
    </SectionStoreContext.Provider>
  );
}

export function useSectionStore(selector: any) {
  let store = useContext(SectionStoreContext);
  if (!store) {
    throw new Error("useSectionStore must be used within a SectionProvider");
  }
  return useStore(store, selector);
}
