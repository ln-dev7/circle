'use client';

import { useIssueDropLandingStore } from '@/store/issue-drop-landing-store';
import { useIssuesStore } from '@/store/issues-store';
import { motion } from 'motion/react';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { IssueDragPreviewGrid, IssueDragPreviewList } from './issue-grid';

function listPreviewWidthPx(): number {
   if (typeof window === 'undefined') return 576;
   return Math.min(576, window.innerWidth - 24);
}

export function IssueDropLandingOverlay() {
   const landing = useIssueDropLandingStore((s) => s.landing);
   const clearLanding = useIssueDropLandingStore((s) => s.clearLanding);
   const liveIssue = useIssuesStore((s) =>
      landing ? s.issues.find((i) => i.id === landing.issueId) : undefined
   );

   const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
   const landingKeyRef = useRef<string | null>(null);

   const displayIssue = liveIssue ?? landing?.issue;

   const startBox = useMemo(() => {
      if (!landing) return null;
      const isList = landing.previewVariant === 'list';
      return {
         left: landing.x,
         top: landing.y,
         width: isList ? listPreviewWidthPx() : 348,
         height: isList ? 44 : 168,
      };
   }, [landing]);

   useLayoutEffect(() => {
      if (!landing) {
         landingKeyRef.current = null;
         setTargetRect(null);
         return;
      }

      const activeLanding = landing;
      const key = `${activeLanding.issueId}-${activeLanding.x}-${activeLanding.y}`;
      if (landingKeyRef.current !== key) {
         landingKeyRef.current = key;
         setTargetRect(null);
      }

      let cancelled = false;

      function measure(): boolean {
         const el = document.querySelector<HTMLElement>(
            `[data-issue-drop-land="${activeLanding.issueId}"]`
         );
         if (!el || cancelled) return false;
         setTargetRect(el.getBoundingClientRect());
         return true;
      }

      if (!measure()) {
         const id = requestAnimationFrame(() => {
            if (!cancelled) measure();
         });
         return () => {
            cancelled = true;
            cancelAnimationFrame(id);
         };
      }

      return () => {
         cancelled = true;
      };
   }, [landing]);

   useEffect(() => {
      if (!landing) return;
      const t = window.setTimeout(() => {
         clearLanding();
      }, 400);
      return () => window.clearTimeout(t);
   }, [landing, clearLanding]);

   if (!landing || !startBox || !displayIssue) {
      return null;
   }

   const isList = landing.previewVariant === 'list';
   const landingMountKey = `${landing.issueId}-${landing.x}-${landing.y}`;

   return (
      <motion.div
         key={landingMountKey}
         className="pointer-events-none fixed z-[60] overflow-hidden rounded-md border-2 border-dashed border-ring bg-accent/30 shadow-md dark:border-sidebar-border dark:bg-sidebar-accent/50"
         initial={{
            left: startBox.left,
            top: startBox.top,
            width: startBox.width,
            height: startBox.height,
         }}
         animate={
            targetRect
               ? {
                    left: targetRect.left,
                    top: targetRect.top,
                    width: targetRect.width,
                    height: targetRect.height,
                 }
               : {
                    left: startBox.left,
                    top: startBox.top,
                    width: startBox.width,
                    height: startBox.height,
                 }
         }
         transition={{
            left: { type: 'tween', duration: 0.24, ease: [0.25, 0.1, 0.25, 1] },
            top: { type: 'tween', duration: 0.24, ease: [0.25, 0.1, 0.25, 1] },
            width: { type: 'tween', duration: 0.24, ease: [0.25, 0.1, 0.25, 1] },
            height: { type: 'tween', duration: 0.24, ease: [0.25, 0.1, 0.25, 1] },
         }}
      >
         <div className="size-full min-h-0 overflow-hidden [&>*]:h-full [&>*]:min-h-0">
            {isList ? (
               <IssueDragPreviewList issue={displayIssue} />
            ) : (
               <IssueDragPreviewGrid issue={displayIssue} />
            )}
         </div>
      </motion.div>
   );
}
