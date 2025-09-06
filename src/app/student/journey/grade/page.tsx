
"use client";

import { Suspense } from 'react';
import GradeSelector from './grade-selector';

export default function SelectGradePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <GradeSelector />
        </Suspense>
    )
}
