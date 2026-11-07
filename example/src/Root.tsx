import React from 'react';
import {Composition} from 'remotion';
import {ContohHalo} from './Composition';
export const Root: React.FC = () => (
  <Composition id="ContohHalo" component={ContohHalo} durationInFrames={300} fps={30} width={1920} height={1080} />
);
