from fastapi import APIRouter, HTTPException
from app.schemas.schemas import AIAssistantRequest, AIAssistantResponse
from app.services.ai_service import generate_ai_assistant_explanation

router = APIRouter(prefix="/api/ai", tags=["ai"])

@router.post("/assistant", response_model=AIAssistantResponse)
async def get_ai_assistant_guidance(payload: AIAssistantRequest):
    if not payload.text.strip():
        raise HTTPException(status_code=400, detail="Text query is required")

    data = await generate_ai_assistant_explanation(
        text=payload.text,
        context=payload.context,
        mode=payload.mode
    )
    return data
