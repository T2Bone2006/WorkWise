"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Upload, FileSpreadsheet, Download, Loader2, CheckCircle, AlertCircle, Plus, X } from "lucide-react";
import { toast } from "sonner";

interface JobForm {
    id: string;
    title: string;
    description: string;
    propertyAddress: string;
    urgency: string;
    preferredDate: string;
}

export function BulkJobUpload({ onCompleteAction }: { onCompleteAction: () => void }) {
    const [mode, setMode] = useState<'form' | 'csv'>('form');
    const [jobs, setJobs] = useState<JobForm[]>([
        { id: '1', title: '', description: '', propertyAddress: '', urgency: 'medium', preferredDate: '' }
    ]);
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [results, setResults] = useState<{ success: number; failed: number } | null>(null);

    // Form mode functions
    const addJob = () => {
        setJobs([...jobs, {
            id: Date.now().toString(),
            title: '',
            description: '',
            propertyAddress: '',
            urgency: 'medium',
            preferredDate: ''
        }]);
    };

    const removeJob = (id: string) => {
        if (jobs.length === 1) return;
        setJobs(jobs.filter(j => j.id !== id));
    };

    const updateJob = (id: string, field: keyof JobForm, value: string) => {
        setJobs(jobs.map(j => j.id === id ? { ...j, [field]: value } : j));
    };

    // Convert dd/MM/yyyy to yyyy-MM-dd for backend
    const convertDateToISO = (dateStr: string): string | null => {
        if (!dateStr) return null;

        // Check if already in yyyy-MM-dd format
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            return dateStr;
        }

        // Parse dd/MM/yyyy format
        const parts = dateStr.split('/');
        if (parts.length === 3) {
            const [day, month, year] = parts;
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }

        return null;
    };

    const handleFormSubmit = async () => {
        const validJobs = jobs.filter(j => j.title && j.description && j.propertyAddress);

        if (validJobs.length === 0) {
            toast.error('Please fill in at least one complete job');
            return;
        }

        setIsUploading(true);
        setProgress(0);
        setResults(null);

        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < validJobs.length; i++) {
            try {
                const jobData = {
                    ...validJobs[i],
                    preferredDate: convertDateToISO(validJobs[i].preferredDate)
                };

                const response = await fetch('/api/jobs/bulk', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ job: jobData }),
                });

                if (response.ok) {
                    successCount++;
                } else {
                    failCount++;
                }
            } catch (error) {
                failCount++;
            }

            setProgress(Math.round(((i + 1) / validJobs.length) * 100));
        }

        setResults({ success: successCount, failed: failCount });
        setIsUploading(false);

        if (failCount === 0) {
            toast.success(`Successfully created ${successCount} jobs!`);
            setTimeout(() => {
                onCompleteAction();
            }, 2000);
        } else {
            toast.warning(`Created ${successCount} jobs, ${failCount} failed`);
        }
    };

    const downloadTemplate = () => {
        const csv = `Title,Description,Address,Urgency,Preferred Date
Fix leaking tap,Kitchen tap dripping constantly,123 High St Manchester M1 1AA,high,20/01/2025
Install sockets,Need 5 new sockets in office,456 Market St Manchester M2 2BB,medium,25/01/2025
Replace light fixtures,Replace 3 ceiling lights in hallway,789 Chapel St Manchester M3 3CC,low,01/02/2025`;

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'workwise-bulk-jobs-template.csv';
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success('Template downloaded!');
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setProgress(0);
        setResults(null);

        try {
            const text = await file.text();
            const lines = text.split('\n').filter(line => line.trim());
            const csvJobs = lines.slice(1).map(line => {
                const values = line.split(',');
                return {
                    title: values[0]?.trim(),
                    description: values[1]?.trim(),
                    propertyAddress: values[2]?.trim(),
                    urgency: values[3]?.trim() || 'medium',
                    preferredDate: convertDateToISO(values[4]?.trim()),
                };
            });

            let successCount = 0;
            let failCount = 0;

            for (let i = 0; i < csvJobs.length; i++) {
                try {
                    const response = await fetch('/api/jobs/bulk', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ job: csvJobs[i] }),
                    });

                    if (response.ok) successCount++;
                    else failCount++;
                } catch (error) {
                    failCount++;
                }

                setProgress(Math.round(((i + 1) / csvJobs.length) * 100));
            }

            setResults({ success: successCount, failed: failCount });

            if (failCount === 0) {
                toast.success(`Successfully uploaded ${successCount} jobs!`);
                setTimeout(() => onCompleteAction(), 2000);
            } else {
                toast.warning(`Uploaded ${successCount} jobs, ${failCount} failed`);
            }

        } catch (error) {
            toast.error('Failed to process file');
            console.error(error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Card className="p-6">
            <div className="space-y-6">
                {/* Header with mode toggle */}
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold">Bulk Job Creation</h3>
                        <p className="text-sm text-muted-foreground">
                            Create multiple jobs at once
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant={mode === 'form' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setMode('form')}
                        >
                            Form
                        </Button>
                        <Button
                            variant={mode === 'csv' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setMode('csv')}
                        >
                            CSV Upload
                        </Button>
                    </div>
                </div>

                {/* Form Mode */}
                {mode === 'form' && !isUploading && !results && (
                    <div className="space-y-4">
                        {jobs.map((job, index) => (
                            <Card key={job.id} className="p-4 space-y-3">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-medium">Job {index + 1}</h4>
                                    {jobs.length > 1 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeJob(job.id)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>

                                <Input
                                    placeholder="Job title (e.g., Fix leaking tap)"
                                    value={job.title}
                                    onChange={(e) => updateJob(job.id, 'title', e.target.value)}
                                />

                                <Textarea
                                    placeholder="Description (e.g., Kitchen tap dripping constantly)"
                                    value={job.description}
                                    onChange={(e) => updateJob(job.id, 'description', e.target.value)}
                                    rows={2}
                                />

                                <Input
                                    placeholder="Property address"
                                    value={job.propertyAddress}
                                    onChange={(e) => updateJob(job.id, 'propertyAddress', e.target.value)}
                                />

                                <div className="grid grid-cols-2 gap-3">
                                    <Select
                                        value={job.urgency}
                                        onValueChange={(value) => updateJob(job.id, 'urgency', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">Low</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Input
                                        type="date"
                                        value={job.preferredDate}
                                        onChange={(e) => updateJob(job.id, 'preferredDate', e.target.value)}
                                    />
                                </div>
                            </Card>
                        ))}

                        <div className="flex gap-2">
                            <Button variant="outline" onClick={addJob} className="flex-1">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Another Job
                            </Button>
                            <Button onClick={handleFormSubmit} className="flex-1">
                                Create {jobs.length} {jobs.length === 1 ? 'Job' : 'Jobs'}
                            </Button>
                        </div>
                    </div>
                )}

                {/* CSV Mode */}
                {mode === 'csv' && !isUploading && !results && (
                    <div className="space-y-4">
                        {/* Instructions */}
                        <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg space-y-2">
                            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                📋 CSV Format Instructions
                            </p>
                            <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                                <li><strong>Title:</strong> Job name (e.g., "Fix leaking tap")</li>
                                <li><strong>Description:</strong> Details about the work</li>
                                <li><strong>Address:</strong> Full property address</li>
                                <li><strong>Urgency:</strong> Must be "low", "medium", or "high"</li>
                                <li><strong>Preferred Date:</strong> Format dd/MM/yyyy (e.g., 20/01/2025)</li>
                            </ul>
                        </div>

                        {/* Download Template */}
                        <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
                            <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
                            <div className="flex-1">
                                <p className="text-sm font-medium">Download Template</p>
                                <p className="text-xs text-muted-foreground">CSV file with example data and correct format</p>
                            </div>
                            <Button variant="outline" size="sm" onClick={downloadTemplate}>
                                <Download className="h-4 w-4 mr-2" />
                                Download
                            </Button>
                        </div>

                        {/* Upload */}
                        <div className="border-2 border-dashed rounded-lg p-8 text-center">
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleFileUpload}
                                className="hidden"
                                id="bulk-upload"
                            />
                            <label htmlFor="bulk-upload" className="cursor-pointer">
                                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-sm font-medium mb-1">Click to upload CSV</p>
                                <p className="text-xs text-muted-foreground">or drag and drop</p>
                            </label>
                        </div>
                    </div>
                )}

                {/* Progress */}
                {isUploading && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                            <div className="flex-1">
                                <div className="flex justify-between text-sm mb-2">
                                    <span>Creating jobs and finding workers...</span>
                                    <span>{progress}%</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                    <div
                                        className="bg-primary h-2 rounded-full transition-all"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Results */}
                {results && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="h-5 w-5" />
                            <span className="font-medium">{results.success} jobs created successfully</span>
                        </div>
                        {results.failed > 0 && (
                            <div className="flex items-center gap-2 text-orange-600">
                                <AlertCircle className="h-5 w-5" />
                                <span className="font-medium">{results.failed} jobs failed</span>
                            </div>
                        )}
                        <Button onClick={() => { setResults(null); setJobs([{ id: '1', title: '', description: '', propertyAddress: '', urgency: 'medium', preferredDate: '' }]); }} variant="outline" className="w-full">
                            Create More Jobs
                        </Button>
                    </div>
                )}
            </div>
        </Card>
    );
}