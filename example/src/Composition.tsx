import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence} from 'remotion';

// A minimal example written specifically for this tutorial.
// The base pattern is always the same: every movement is computed from the frame number.

const Judul: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const masuk = spring({frame, fps, config: {damping: 12, stiffness: 110}});
  const y = interpolate(masuk, [0, 1], [70, 0]);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', backgroundColor: '#10131F', fontFamily: 'Arial, sans-serif'}}>
      <div style={{fontSize: 130, fontWeight: 900, color: '#F5F6FF', opacity: masuk, transform: `translateY(${y}px)`}}>
        Hello, Remotion!
      </div>
      <div style={{fontSize: 44, color: '#9AA0C7', marginTop: 24, opacity: masuk}}>
        This video is written as React code.
      </div>
    </AbsoluteFill>
  );
};

const Penutup: React.FC = () => {
  const frame = useCurrentFrame();
  const lebar = interpolate(frame, [10, 110], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', backgroundColor: '#10131F', fontFamily: 'Arial, sans-serif'}}>
      <div style={{fontSize: 84, fontWeight: 900, color: '#F5F6FF', marginBottom: 40}}>Render complete.</div>
      <div style={{width: 720, height: 30, backgroundColor: '#232842', borderRadius: 15}}>
        <div style={{width: `${lebar}%`, height: '100%', backgroundColor: '#4BE1C3', borderRadius: 15}} />
      </div>
      <div style={{fontSize: 40, color: '#9AA0C7', marginTop: 28}}>{Math.round(lebar)}%</div>
    </AbsoluteFill>
  );
};

export const HelloExample: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={150}>
      <Judul />
    </Sequence>
    <Sequence from={150} durationInFrames={150}>
      <Penutup />
    </Sequence>
  </AbsoluteFill>
);
