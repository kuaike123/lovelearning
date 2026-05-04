import React from 'react';

import {designTokens} from '../styles/tokens';
import {Button} from './Button';
import {Card} from './Card';

export type SampleGalleryItem = {
  durationSec: number;
  href: string;
  id: string;
  style: string;
  subject: string;
  title: string;
  voice: string;
};

type SampleGalleryProps = {
  activeSubject?: string;
  samples: SampleGalleryItem[];
};

export function SampleGallery({activeSubject, samples}: SampleGalleryProps) {
  const visibleSamples = activeSubject
    ? samples.filter((sample) => sample.subject === activeSubject)
    : samples;

  return (
    <section
      data-active-filter={activeSubject}
      data-filter-update-ms="200"
      data-keyboard-navigation="arrow-enter"
      data-sample-gallery="responsive-grid"
      style={galleryStyle}
    >
      {visibleSamples.map((sample) => (
        <article key={sample.id} tabIndex={0}>
          <Card
            elevation="low"
            footer={
              <div style={footerStyle}>
                <Button type="button" variant="secondary">
                  预览
                </Button>
                <a data-chat-sample-preset={sample.id} href={sample.href} style={useLinkStyle}>
                  套用
                </a>
              </div>
            }
            header={sample.title}
          >
            <div data-sample-preview="side-panel" style={metadataStyle}>
              <span>{sample.subject}</span>
              <span>{sample.style}</span>
              <span>{sample.voice}</span>
              <span>{sample.durationSec} 秒</span>
            </div>
          </Card>
        </article>
      ))}
    </section>
  );
}

const galleryStyle = {
  display: 'grid',
  gap: designTokens.spacing[4],
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))'
};

const metadataStyle = {
  color: designTokens.colors.neutral600,
  display: 'grid',
  fontSize: designTokens.typography.sizeSm,
  gap: designTokens.spacing[2]
};

const footerStyle = {
  alignItems: 'center',
  display: 'flex',
  gap: designTokens.spacing[2],
  justifyContent: 'space-between'
};

const useLinkStyle = {
  color: designTokens.colors.primary,
  fontSize: designTokens.typography.sizeSm,
  fontWeight: designTokens.typography.weightBold,
  textDecoration: 'none'
};
