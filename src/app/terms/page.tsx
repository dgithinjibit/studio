
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function TermsAndConditionsPage() {
    return (
        <div className="container mx-auto py-12 px-4 md:px-6">
            <div className="mb-8">
                <Button variant="ghost" asChild>
                    <Link href="/">
                        <ArrowLeft className="mr-2" />
                        Back to Home
                    </Link>
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">Terms and Conditions</CardTitle>
                    <CardDescription>Last updated: September 09, 2025</CardDescription>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none text-muted-foreground">
                    <p>
                        <strong>Disclaimer:</strong> This is a template and not legal advice. You should consult with a legal professional to create terms and conditions that are appropriate for your specific situation.
                    </p>

                    <h2>1. Introduction</h2>
                    <p>
                        Welcome to SyncSenta ("we", "our", "us"). These Terms and Conditions govern your use of our application and services. By accessing or using our service, you agree to be bound by these terms. If you disagree with any part of the terms, then you may not access the service.
                    </p>

                    <h2>2. Intellectual Property</h2>
                    <p>
                        The Service and its original content, features, and functionality are and will remain the exclusive property of dantedone and its licensors. The Service is protected by copyright, trademark, and other laws of both Kenya and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of dantedone.
                    </p>

                    <h2>3. User Accounts</h2>
                    <p>
                        When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
                    </p>

                    <h2>4. Content</h2>
                    <p>
                        Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post on or through the Service, including its legality, reliability, and appropriateness.
                    </p>
                    
                     <h2>5. Limitation of Liability</h2>
                    <p>
                        In no event shall dantedone, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
                    </p>

                    <h2>6. Governing Law</h2>
                    <p>
                        These Terms shall be governed and construed in accordance with the laws of Kenya, without regard to its conflict of law provisions.
                    </p>
                    
                    <h2>7. Changes</h2>
                    <p>
                        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                    </p>

                    <h2>8. Contact Us</h2>
                    <p>
                        If you have any questions about these Terms, please contact us.
                    </p>

                </CardContent>
            </Card>
        </div>
    );
}
