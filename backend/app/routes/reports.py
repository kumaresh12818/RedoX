from fastapi import APIRouter, Depends, HTTPException
from starlette.concurrency import run_in_threadpool
from ..routes.auth import get_current_user
from ..firebase_client import get_user_reports, get_report, delete_report

router = APIRouter()


@router.get("/reports")
async def list_reports(user: dict = Depends(get_current_user)):
    """Return all reports for the authenticated user."""
    user_id = user["uid"]
    reports = await run_in_threadpool(get_user_reports, user_id)
    return {"reports": reports}


@router.get("/reports/{scan_id}")
async def get_single_report(scan_id: str, user: dict = Depends(get_current_user)):
    """Return a single report by scan_id."""
    user_id = user["uid"]
    report = await run_in_threadpool(get_report, user_id, scan_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return {"report": report}


@router.delete("/reports/{scan_id}")
async def remove_report(scan_id: str, user: dict = Depends(get_current_user)):
    """Delete a report and its associated image."""
    user_id = user["uid"]
    await run_in_threadpool(delete_report, user_id, scan_id)
    return {"message": "Report deleted successfully"}
