from pydantic import BaseModel
from typing import Optional, List


class ScanMetadata(BaseModel):
    scan_type: str
    confidence_score: float
    clarity: str  # "high" | "medium" | "low"


class AnalysisReport(BaseModel):
    status: str  # "success" | "invalid"
    metadata: Optional[ScanMetadata] = None
    clinical_findings: Optional[str] = None
    impression: Optional[str] = None
    recovery_guidance: Optional[List[str]] = None
    disclaimer: str = "This is an AI-generated report for educational purposes and must be verified by a medical professional."
    error: Optional[str] = None


class ReportResponse(BaseModel):
    report: AnalysisReport
    scan_id: str
    image_url: Optional[str] = None
    created_at: Optional[str] = None
    file_name: Optional[str] = None


class ReportListItem(BaseModel):
    scan_id: str
    scan_type: Optional[str] = None
    confidence_score: Optional[float] = None
    status: str
    created_at: Optional[str] = None
    image_url: Optional[str] = None
    file_name: Optional[str] = None
