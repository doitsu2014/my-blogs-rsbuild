// Note: This file contains auth utilities from the old Next.js platform
// It will need to be adapted for the new architecture without next-auth
// For now, keeping it as a placeholder for future implementation

export const buildHeader = async (includeAuthorizedToken: boolean = true, isContentTypeJson: boolean = true) => {
  // TODO: Implement authentication header building for new architecture
  // This previously used next-auth session which is Next.js specific
  
  let header: any = {};

  // Placeholder for authorization token
  // if (includeAuthorizedToken && session?.accessToken) {
  //   header['Authorization'] = `Bearer ${session.accessToken}`;
  // }

  if (isContentTypeJson) {
    header["Content-Type"] = 'application/json';
  }

  return header;
};
