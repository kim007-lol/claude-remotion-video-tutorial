import React from 'react';
import {Composition} from 'remotion';
import {HelloExample} from './Composition';
export const Root: React.FC = () => (
  <Composition id="HelloExample" component={HelloExample} durationInFrames={300} fps={30} width={1920} height={1080} />
);
