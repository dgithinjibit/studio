
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
const blockchainSubject: Subject = { name: 'Blockchain', icon: '/assets/blockchain.png' };

const commonSubjects: Subject[] = [
    { name: 'English', icon: '/assets/english.png' },
    { name: 'Creative Arts', icon: '/assets/creative_arts.png' },
    { name: 'Indigenous Language', icon: '/assets/indigenous_language.png' },
    { name: 'Kiswahili', icon: '/assets/kiswahili.png' },
    { name: 'Kenyan Sign Language', icon: '/assets/sign_language.png' },
    { name: 'Religious Education', icon: '/assets/religious_education.png' },
    { name: 'Environmental Activities', icon: '/assets/environmental_activities.png' },
    { name: 'Creative Activities', icon: '/assets/creative_activities.png' },
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
