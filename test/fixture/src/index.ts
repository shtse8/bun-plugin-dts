// Simple test fixture
export interface User {
  id: number;
  name: string;
}

export function getUser(id: number): User {
  return { id, name: 'Test User' };
}

const user = getUser(1);
console.log(`Fixture: Hello, ${user.name}!`);