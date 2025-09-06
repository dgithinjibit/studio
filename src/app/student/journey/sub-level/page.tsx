
"use client";

import { Suspense } from 'react';
import SubLevelSelector from './sub-level-selector';

export default function SelectSubLevelPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SubLevelSelector />
        </Suspense>
    )
}
