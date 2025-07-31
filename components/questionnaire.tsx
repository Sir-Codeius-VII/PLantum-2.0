"use client"

import { useState } from "react"
import { CheckCircle2, ChevronRight, BarChart2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export interface QuestionnaireOption {
  id: string
  text: string
  votes: number
}

export interface QuestionnaireQuestion {
  id: string
  text: string
  options: QuestionnaireOption[]
}

export interface QuestionnaireProps {
  id: string
  title: string
  description?: string
  questions: QuestionnaireQuestion[]
  totalResponses: number
  onSubmit?: (responses: Record<string, string>) => void
  className?: string
}

export function Questionnaire({
  id,
  title,
  description,
  questions,
  totalResponses,
  onSubmit,
  className,
}: QuestionnaireProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [showResults, setShowResults] = useState(false)

  // Update the handleOptionSelect function to prevent multiple selections on the same question
  const handleOptionSelect = (questionId: string, optionId: string) => {
    if (submitted) return // Prevent changes after submission

    setResponses((prev) => ({
      ...prev,
      [questionId]: optionId,
    }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      handleSubmit()
    }
  }

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(responses)
    }
    setSubmitted(true)
    setShowResults(true)
  }

  const calculatePercentage = (votes: number) => {
    const total =
      questions[currentQuestion].options.reduce((sum, option) => sum + option.votes, 0) + (submitted ? 1 : 0)
    return total > 0 ? Math.round((votes / total) * 100) : 0
  }

  const isQuestionAnswered = (questionId: string) => {
    return responses[questionId] !== undefined
  }

  const isCurrentQuestionAnswered = () => {
    return isQuestionAnswered(questions[currentQuestion].id)
  }

  // Fix the calculation for the progress percentage
  const progressPercentage = Math.round(((currentQuestion + 1) / questions.length) * 100)

  // Make sure the component properly resets when needed
  const resetQuestionnaire = () => {
    setCurrentQuestion(0)
    setResponses({})
    setSubmitted(false)
    setShowResults(false)
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <Badge variant="outline" className="flex items-center gap-1">
            <BarChart2 className="h-3 w-3" />
            {totalResponses + (submitted ? 1 : 0)} responses
          </Badge>
        </div>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Progress indicator */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-muted-foreground">{progressPercentage}%</span>
          </div>
          <Progress value={((currentQuestion + 1) / questions.length) * 100} className="h-1" />

          {/* Current question */}
          <div className="py-2">
            <h3 className="font-medium mb-3">{questions[currentQuestion].text}</h3>
            <RadioGroup
              value={responses[questions[currentQuestion].id]}
              onValueChange={(value) => handleOptionSelect(questions[currentQuestion].id, value)}
            >
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option) => (
                  <div key={option.id} className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={option.id} id={`option-${option.id}`} disabled={showResults} />
                      <Label htmlFor={`option-${option.id}`} className="flex-1">
                        {option.text}
                      </Label>
                      {showResults && <span className="text-sm font-medium">{calculatePercentage(option.votes)}%</span>}
                    </div>
                    {showResults && <Progress value={calculatePercentage(option.votes)} className="h-2" />}
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        {!showResults ? (
          <div className="flex justify-end w-full">
            <Button onClick={handleNext} disabled={!isCurrentQuestionAnswered()} className="gap-1">
              {currentQuestion < questions.length - 1 ? "Next" : "Submit"}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="w-full text-center">
            <div className="flex items-center justify-center text-emerald-500 mb-2">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              <span className="font-medium">Thanks for your response!</span>
            </div>
            {currentQuestion < questions.length - 1 && (
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentQuestion((prev) => prev + 1)
                  setShowResults(false)
                }}
                className="mt-2"
              >
                Next question
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

