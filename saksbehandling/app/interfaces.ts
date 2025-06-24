// lar meg loope gjennom brukerroller
const UserRoleDict = {
  bruker: "Bruker",
  behandler: "Behandler",
};
// gjør at jeg har en userRole type som er en union av keys i UserRoleDict
type UserRole = keyof typeof UserRoleDict;

type CaseStatus = "åpen" | "lukket";
type CaseCategory = "Teknisk problem" | "Forespørsel" | "Tilbakemelding";

interface CustomUserData {
  id: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

interface Comment {
  id: string;
  comment: string;
  commenter: string;
  createdAt: Date;
}

interface Case {
  id: string;
  status: CaseStatus;
  category: CaseCategory;
  title: string;
  description?: string;
  creator: string;
  createdAt: Date;
  updatedAt: Date;
  priority: number;
  comments?: Comment[];
}

export type { UserRole, CaseStatus, CaseCategory, CustomUserData, Comment, Case };
// ikke i forrige linje da det er en verdi ikke en type
export { UserRoleDict };