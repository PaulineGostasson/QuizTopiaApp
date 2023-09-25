import { Api,  LoginSuccessful } from "../interfaces";

const ApiKey = 'https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com';

export async function registerNewUser(username: string, password: string): Promise<boolean> {
  try {
    const url: string = `${ApiKey}/auth/signup`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to register user: ${response.status} ${response.statusText}`);
    }

    const data: Api = await response.json();
    console.log(data);

    return data.success;
  } catch (error) {
    console.error(error);
    return false;
  }
}

  
export async function LogIn(username: string, password: string): Promise<LoginSuccessful> {
    try {
      const url: string = `${ApiKey}/auth/login`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error(`Login failed: ${response.status} ${response.statusText}`);
      }

      const data: LoginSuccessful = await response.json();
      console.log(data);

      return data;
    } catch (error) {
      console.error('Error: Login unsuccessful', error);
      throw error;
    }
  }
