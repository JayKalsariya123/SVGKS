export const DIVISIONS = {
  PRESCHOOL: 'Pre-School',
  PRIMARY: 'Primary (1-5)',
  MIDDLE: 'Middle (6-10)',
  MIDDLE_GENERAL: 'Middle (6-10 General)',
  SECONDARY: 'Secondary (11-12)'
};

export const DEPARTMENTS = {
  GENERAL: 'General',
  STAR: 'Star',
  SCIENCE: 'Science',
  COMMERCE: 'Commerce',
  ARTS: 'Arts'
};

export const CLASSES = [
  { id: 'play-group', name: 'Play Group', division: DIVISIONS.PRESCHOOL },
  { id: 'nursery', name: 'Nursery', division: DIVISIONS.PRESCHOOL },
  { id: 'jkg-a', name: 'JKG-A', division: DIVISIONS.PRESCHOOL },
  { id: 'jkg-b', name: 'JKG-B', division: DIVISIONS.PRESCHOOL },
  { id: 'skg-a', name: 'SKG-A', division: DIVISIONS.PRESCHOOL },
  { id: 'skg-b', name: 'SKG-B', division: DIVISIONS.PRESCHOOL },
  
  { id: '1-a', name: '1/A', division: DIVISIONS.PRIMARY, department: DEPARTMENTS.GENERAL },
  { id: '1-b', name: '1/B', division: DIVISIONS.PRIMARY, department: DEPARTMENTS.GENERAL },
  { id: '2-a', name: '2/A', division: DIVISIONS.PRIMARY, department: DEPARTMENTS.GENERAL },
  { id: '2-b', name: '2/B', division: DIVISIONS.PRIMARY, department: DEPARTMENTS.GENERAL },
  { id: '3-a', name: '3/A', division: DIVISIONS.PRIMARY, department: DEPARTMENTS.GENERAL },
  { id: '4-a', name: '4/A', division: DIVISIONS.PRIMARY, department: DEPARTMENTS.GENERAL },
  { id: '4-b', name: '4/B', division: DIVISIONS.PRIMARY, department: DEPARTMENTS.GENERAL },
  { id: '5-a', name: '5/A', division: DIVISIONS.PRIMARY, department: DEPARTMENTS.GENERAL },
  { id: '5-b', name: '5/B', division: DIVISIONS.PRIMARY, department: DEPARTMENTS.GENERAL },
  
  { id: '6-a', name: '6/A', division: DIVISIONS.MIDDLE, department: DEPARTMENTS.GENERAL },
  { id: '7-a', name: '7/A', division: DIVISIONS.MIDDLE, department: DEPARTMENTS.GENERAL },
  { id: '8-a', name: '8/A', division: DIVISIONS.MIDDLE, department: DEPARTMENTS.GENERAL },
  { id: '9-a', name: '9/A', division: DIVISIONS.MIDDLE, department: DEPARTMENTS.GENERAL },
  { id: '10-a', name: '10/A', division: DIVISIONS.MIDDLE, department: DEPARTMENTS.GENERAL },
  
  { id: '6-b', name: '6/B', division: DIVISIONS.MIDDLE_GENERAL, department: DEPARTMENTS.GENERAL },
  { id: '7-b', name: '7/B', division: DIVISIONS.MIDDLE_GENERAL, department: DEPARTMENTS.GENERAL },
  { id: '8-b', name: '8/B', division: DIVISIONS.MIDDLE_GENERAL, department: DEPARTMENTS.GENERAL },
  { id: '9-b', name: '9/B', division: DIVISIONS.MIDDLE_GENERAL, department: DEPARTMENTS.GENERAL },
  { id: '10-b', name: '10/B', division: DIVISIONS.MIDDLE_GENERAL, department: DEPARTMENTS.GENERAL },
  
  { id: '11-sci', name: '11/Sci.', division: DIVISIONS.SECONDARY, department: DEPARTMENTS.SCIENCE },
  { id: '12-sci', name: '12/Sci.', division: DIVISIONS.SECONDARY, department: DEPARTMENTS.SCIENCE },
  { id: '11-com', name: '11/Com.', division: DIVISIONS.SECONDARY, department: DEPARTMENTS.COMMERCE },
  { id: '12-com', name: '12/Com.', division: DIVISIONS.SECONDARY, department: DEPARTMENTS.COMMERCE },
  { id: '11-arts', name: '11/Arts', division: DIVISIONS.SECONDARY, department: DEPARTMENTS.ARTS },
  { id: '12-arts', name: '12/Arts', division: DIVISIONS.SECONDARY, department: DEPARTMENTS.ARTS }
];

export const getClassesByDivision = (division: string) => {
  return CLASSES.filter(cls => cls.division === division);
};

export const getClassById = (classId: string) => {
  return CLASSES.find(cls => cls.id === classId);
};
