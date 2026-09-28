import instance from "@/utils/request";
import type { RuleForm } from "@/types";

export const login = (data: RuleForm) => {
    return instance.post<RuleForm>('/login', data)
}