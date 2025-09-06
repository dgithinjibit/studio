
"use client";

import { Suspense } from 'react';
import SubjectSelector from './subject-selector';

export default function SelectSubjectPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SubjectSelector />
        </Suspense>
    )
}
