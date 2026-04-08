"use client";

import { useReducer, useCallback } from "react";
import { QUESTIONS } from "@/lib/constants";

interface AssessmentState {
  currentStep: number;
  answers: Record<string, unknown>;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    gdprConsent: boolean;
  };
  isSubmitting: boolean;
  error: string | null;
}

type AssessmentAction =
  | { type: "SET_ANSWER"; questionId: string; value: unknown }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "SET_CONTACT"; field: string; value: string | boolean }
  | { type: "SET_SUBMITTING"; value: boolean }
  | { type: "SET_ERROR"; value: string | null };

const initialState: AssessmentState = {
  currentStep: 0,
  answers: {},
  contactInfo: {
    name: "",
    email: "",
    phone: "",
    gdprConsent: false,
  },
  isSubmitting: false,
  error: null,
};

function reducer(
  state: AssessmentState,
  action: AssessmentAction
): AssessmentState {
  switch (action.type) {
    case "SET_ANSWER":
      return {
        ...state,
        answers: { ...state.answers, [action.questionId]: action.value },
        error: null,
      };
    case "NEXT_STEP":
      return { ...state, currentStep: state.currentStep + 1, error: null };
    case "PREV_STEP":
      return {
        ...state,
        currentStep: Math.max(0, state.currentStep - 1),
        error: null,
      };
    case "SET_CONTACT":
      return {
        ...state,
        contactInfo: { ...state.contactInfo, [action.field]: action.value },
        error: null,
      };
    case "SET_SUBMITTING":
      return { ...state, isSubmitting: action.value };
    case "SET_ERROR":
      return { ...state, error: action.value, isSubmitting: false };
    default:
      return state;
  }
}

export function useAssessment() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const totalSteps = QUESTIONS.length + 1; // questions + contact form
  const isQuestionStep = state.currentStep < QUESTIONS.length;
  const isContactStep = state.currentStep === QUESTIONS.length;
  const currentQuestion = isQuestionStep
    ? QUESTIONS[state.currentStep]
    : null;

  const setAnswer = useCallback((questionId: string, value: unknown) => {
    dispatch({ type: "SET_ANSWER", questionId, value });
  }, []);

  const setContact = useCallback((field: string, value: string | boolean) => {
    dispatch({ type: "SET_CONTACT", field, value });
  }, []);

  const goNext = useCallback(() => {
    dispatch({ type: "NEXT_STEP" });
  }, []);

  const goPrev = useCallback(() => {
    dispatch({ type: "PREV_STEP" });
  }, []);

  const setSubmitting = useCallback((value: boolean) => {
    dispatch({ type: "SET_SUBMITTING", value });
  }, []);

  const setError = useCallback((value: string | null) => {
    dispatch({ type: "SET_ERROR", value });
  }, []);

  const canProceed = useCallback((): boolean => {
    if (!isQuestionStep || !currentQuestion) return false;

    const answer = state.answers[currentQuestion.id];

    if (!currentQuestion.required) return true;

    if (currentQuestion.type === "single-select") {
      return !!answer;
    }
    if (currentQuestion.type === "multi-select") {
      return Array.isArray(answer) && answer.length > 0;
    }
    if (currentQuestion.type === "free-text") {
      return typeof answer === "string" && answer.trim().length > 0;
    }
    if (currentQuestion.type === "pain-details") {
      // At least one pain detail must be filled
      const painDetails = answer as Record<string, string> | undefined;
      if (!painDetails) return false;
      return Object.values(painDetails).some((v) => v.trim().length > 0);
    }
    return false;
  }, [state.answers, currentQuestion, isQuestionStep]);

  return {
    ...state,
    totalSteps,
    isQuestionStep,
    isContactStep,
    currentQuestion,
    setAnswer,
    setContact,
    goNext,
    goPrev,
    setSubmitting,
    setError,
    canProceed,
  };
}
