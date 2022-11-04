import { useMutation, useQuery, useSubscription } from "@apollo/client";
import { getAccessToken } from "../auth";
import {
  ADD_MESSAGE_MUTATION,
  MESSAGES_QUERY,
  MESSAGE_ADDED_SUBSCRIPTION,
} from "./queries";

export function useAddMessage() {
  const [mutate] = useMutation(ADD_MESSAGE_MUTATION);

  async function addMessage(text) {
    const {
      data: { message },
    } = await mutate({
      variables: { input: { text } },
      context: {
        headers: { Authorization: "Bearer " + getAccessToken() },
      },
    });
    return message;
  }

  return {
    addMessage,
  };
}

export function useMessages() {
  const { data } = useQuery(MESSAGES_QUERY, {
    context: {
      headers: { Authorization: "Bearer " + getAccessToken() },
    },
  });

  useSubscription(MESSAGE_ADDED_SUBSCRIPTION, {
    onData: ({ client, data: subscription }) => {
      const message = subscription.data.message;

      client.cache.updateQuery({ query: MESSAGES_QUERY }, ({ messages }) => ({
        messages: [...messages, message],
      }));
    },
  });

  return {
    messages: data?.messages ?? [],
  };
}
