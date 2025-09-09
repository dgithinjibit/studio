
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

const aiSubject: Subject = { name: 'AI', icon: '/assets/ai.png' };
const blockchainSubject: Subject = { name: 'Blockchain', icon: '/assets/bc.png' };

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
    { name: 'Creative Activities', icon: '/assets/creative_act.png' },
];

const pastoralInstruction: Subject = { name: 'Pastoral Instruction Programme', icon: '/assets/pastoral_instruction.png' };

export const subjectsMap: { [key: string]: Subject[] } = {
    g4: [...commonSubjects, aiSubject, blockchainSubject],
    g5: [...commonSubjects, aiSubject, blockchainSubject],
    g6: [...commonSubjects, aiSubject, blockchainSubject],
    g7: [...commonSubjects, pastoralInstruction, aiSubject, blockchainSubject],
    g8: [...commonSubjects, pastoralInstruction, aiSubject, blockchainSubject],
    g9: [...commonSubjects, pastoralInstruction, aiSubject, blockchainSubject],
};
