
export type AssignedLearningMaterialsBody = {
    id: string,
    datetime: number,
    isRead: boolean,
    procedureDateTime: string,
    cptCode: string,
    receiverId: string,
    senderId: string,
    learningMaterials: string,
}

export type AssignedLearningMaterial = {
    assignedLearningMaterial: AssignedLearningMaterialsBody,
    learningMaterialAssignerName: string,
    learningMaterialAssigneeName: string,
    mongoDBID: string,
}

export enum Role {
    RESIDENT = 'RESIDENT',
    PHYSICIAN = 'PHYSICIAN',
}

export type UserSearchResult = {
    role: Role,
    id: string,
    fullName: string,
}

export type ProcedureSearchResult = {
    id: string,
    code: string,
    description: string,
    learningMaterials: string,
}

export enum QualityRating {
    NOT_APPLICABLE = 'NOT_APPLICABLE',
    POOR = 'POOR',
    FAIR = 'FAIR',
    GOOD = 'GOOD',
    EXCELLENT = 'EXCELLENT'
}

export type FeedbackBody = {
    id: string,
    datetime: number,
    isRead: boolean,
    procedureDateTime: string,
    cptCode: string,
    briefOperationDescription: string,
    receiverId: string,
    senderId: string,
    tissueHandling: QualityRating,
    knowledgeOfAnatomy: QualityRating,
    knowledgeOfSurgerySteps: QualityRating,
    knowledgeOfPathophysiology: QualityRating,
    communication: QualityRating,
    freeFormFeedback: string,
}

export type FeedbackItem = {
    feedback: FeedbackBody,
    feedbackGiverName: string,
    feedbackReceiverName: string,
    mongoDBID: string,
}