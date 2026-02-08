export async function bulkDeleteComments(ids: string[]) {
    return apiRequest<{ success: boolean; deleted: number }>(\/admin/community/comments/bulk\, {
        method: 'DELETE',
        body: JSON.stringify({ ids }),
    });
}

export async function bulkBanUsers(commentIds: string[]) {
    return apiRequest<{ success: boolean; bannedUsers: number; userIds: string[] }>(\/admin/community/comments/bulk-ban\, {
        method: 'PATCH',
        body: JSON.stringify({ commentIds }),
    });
}
