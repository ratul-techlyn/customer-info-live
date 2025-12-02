
export const stagingUploadMutation = `#graphql
mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
  stagedUploadsCreate(input: $input) {
    stagedTargets {
      url
      resourceUrl
      parameters {
        name
        value
      }
    }
  }
}
`;


export const uploadFileMutation = `#graphql
  mutation fileCreate($files: [FileCreateInput!]!) {
    fileCreate(files: $files) {
      files {
        id
        fileStatus
        alt
        createdAt
        preview{
          image{
            url
          }
        }
      }
    }
  }
`;
