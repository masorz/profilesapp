import { useState, useEffect } from "react";
import {
  Button,
  Heading,
  Flex,
  View,
  Grid,
  Divider,
} from "@aws-amplify/ui-react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";
/**
 * @type {import('aws-amplify/data').Client<import('../amplify/data/resource').Schema>}
 */

Amplify.configure(outputs);

const client = generateClient({
  authMode: "userPool",
});

// Define the UserProfile type based on your schema
type UserProfile = {
  id?: string;
  email?: string;
  [key: string]: any;
};


export default function App() {
  const [userprofiles, setUserProfiles] = useState<UserProfile[]>([]);
  const { signOut } = useAuthenticator((context) => [context.user]);

  useEffect(() => {
    fetchUserProfile();
  }, []);


  async function fetchUserProfile() {
    // If your model is named differently, update 'UserProfile' accordingly
    const { data: profiles } = await (client.models as any).UserProfile.list();
    setUserProfiles(profiles ?? []);
  }

  return (
    <Flex
      className="App"
      justifyContent="center"
      alignItems="center"
      direction="column"
      width="70%"
      margin="0 auto"
    >
      <Heading level={1}>My Profile</Heading>

      <Divider />

      <Grid
        margin="3rem 0"
        autoFlow="column"
        justifyContent="center"
        gap="2rem"
        alignContent="center"
      >
        {userprofiles.map((userprofile) => (
          <Flex
            key={userprofile.id || userprofile.email || Math.random()}
            direction="column"
            justifyContent="center"
            alignItems="center"
            gap="2rem"
            border="1px solid #ccc"
            padding="2rem"
            borderRadius="5%"
            className="box"
          >
            <View>
              <Heading level={3}>{userprofile.email ?? "No Email"}</Heading>
            </View>
          </Flex>
        ))}
      </Grid>
      <Button onClick={signOut}>Sign Out</Button>
    </Flex>
  );
}