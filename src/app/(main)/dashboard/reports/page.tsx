
"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MyResources } from "@/components/my-resources";
import { Library } from "lucide-react";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import type { TeacherResource } from "@/lib/types";


export default function MyResourcesPage() {
    const [resources, setResources] = useState<TeacherResource[]>([]);
    
    useEffect(() => {
        const fetchResources = async () => {
            const querySnapshot = await getDocs(collection(db, "teacherResources"));
            const resourcesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as TeacherResource[];
            setResources(resourcesData);
        };

        fetchResources();

        // Listen for real-time updates
        const unsubscribe = onSnapshot(collection(db, "teacherResources"), (snapshot) => {
             const resourcesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as TeacherResource[];
            setResources(resourcesData);
        });

        return () => unsubscribe();

    }, []);


    return (
        <div>
            <div className="mb-6">
                <h1 className="font-headline text-3xl font-bold">My Library</h1>
                <p className="text-muted-foreground">All your saved Learning Labs, generated documents, and communications organized for easy access.</p>
            </div>
            <MyResources initialResources={resources} />
        </div>
    );
}
