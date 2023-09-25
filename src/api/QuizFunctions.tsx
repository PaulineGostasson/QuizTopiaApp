import { QuizList } from "../interfaces";

const baseUrl = 'https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com';

export async function newQuestion(
  quizId: string,
  question: string,
  answer: string,
  longitude: string,
  latitude: string
): Promise<void> {
  const token = sessionStorage.getItem('token');

  const data = {
    name: quizId,
    question: question,
    answer: answer,
    location: {
      longitude: longitude,
      latitude: latitude,
    },
  };

  const info = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  try {
    const url = `${baseUrl}/quiz/question`;
    const response = await fetch(url, info);
    const responseData = await response.json();

    if (!response.ok || !responseData.success) {
      throw new Error(
        `Request failed: ${response.status} ${response.statusText}`
      );
    }

    localStorage.setItem('quizObject', JSON.stringify(responseData));
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function createQuiz(quizName: string) {
  const token = sessionStorage.getItem('token');

  const info = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: quizName }),
  };

  try {
    const url = `${baseUrl}/quiz`;
    const response = await fetch(url, info);

    if (!response.ok) {
      throw new Error(`Failed to create quiz: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteQuizById(quizId: string): Promise<boolean> {
  const token = sessionStorage.getItem('token');
  const settings = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  const url: string = `${baseUrl}/quiz/${quizId}`;

  try {
    const response = await fetch(url, settings);
    const data = await response.json();
    console.log(data);

    return data.success;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getQuizzes(): Promise<QuizList> {
  try {
    const url: string = `${baseUrl}/quiz`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch quizzes: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data);

    return data;
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    throw error;
  }
}
