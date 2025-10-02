
export type Step = 'start' | 'level' | 'sub-level' | 'grade' | 'subject';

export const levels = [
    { id: 'ms', name: 'Middle School' },
    { id: 'ss', name: 'Senior School' },
];

export const subLevelsMap: { [key: string]: { id: string; name: string }[] } = {
    ms: [
        { id: 'up', name: 'Upper Primary' },
        { id: 'js', name: 'Junior Secondary' },
    ],
    ss: [] 
};

export const gradesMap: { [key: string]: { id: string; name: string }[] } = {
    up: [
        { id: 'g4', name: 'Grade 4' },
        { id: 'g5', name: 'Grade 5' },
        { id: 'g6', name: 'Grade 6' },
    ],
    js: [
        { id: 'g7', name: 'Grade 7' },
        { id: 'g8', name: 'Grade 8' },
        { id: 'g9', 'name': 'Grade 9' },
    ],
};

type Subject = {
    name: string;
    icon: string;
};

export const recommendedSubjects: Subject[] = [
    { name: 'AI', icon: '/assets/ai.png' },
    { name: 'Blockchain', icon: '/assets/bc.png' },
    { name: 'Financial Literacy', icon: '/assets/finance.png' },
];

const commonSubjects: Subject[] = [
    { name: 'English', icon: '/assets/english-icon.png' },
    { name: 'Kiswahili', icon: '/assets/kisw.png' },
    { name: 'Mathematics', icon: '/assets/mathematics.png' },
    { name: 'Social Studies', icon: '/assets/social.png' },
    { name: 'Creative Arts', icon: '/assets/creative_arts.png' },
    { name: 'Religious Education', icon: '/assets/cre.png' },
    { name: 'Environmental Activities', icon: '/assets/envr.png' },
    { name: 'Indigenous Language', icon: '/assets/indig.png' },
    { name: 'Kenyan Sign Language', icon: '/assets/ksl.png' },
];

const pastoralInstruction: Subject = { name: 'Pastoral Instruction Programme', icon: '/assets/pastoral_instruction.png' };

export const subjectsMap: { [key: string]: Subject[] } = {
    g4: [...commonSubjects],
    g5: [...commonSubjects],
    g6: [...commonSubjects],
    g7: [...commonSubjects, pastoralInstruction],
    g8: [...commonSubjects, pastoralInstruction],
    g9: [...commonSubjects, pastoralInstruction],
};

    
