import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface PasswordResetEmailProps {
  name: string;
  resetUrl: string;
}

export function PasswordResetEmail({ name, resetUrl }: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your SecureGate password</Preview>
      <Body style={{ backgroundColor: "#f4f6f9", fontFamily: "Inter, sans-serif" }}>
        <Container style={{ maxWidth: "480px", margin: "40px auto", backgroundColor: "#ffffff", borderRadius: "12px", padding: "40px" }}>
          <Heading style={{ color: "#1a3a5c", fontSize: "24px", marginBottom: "8px" }}>
            Reset your password
          </Heading>
          <Text style={{ color: "#374151", fontSize: "16px" }}>
            Hi {name}, we received a request to reset your SecureGate password.
          </Text>
          <Section style={{ textAlign: "center", margin: "32px 0" }}>
            <Button
              href={resetUrl}
              style={{
                backgroundColor: "#1a6eb5",
                color: "#ffffff",
                padding: "14px 32px",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                textDecoration: "none",
              }}
            >
              Reset password
            </Button>
          </Section>
          <Text style={{ color: "#6b7280", fontSize: "14px" }}>
            This link expires in <strong>1 hour</strong>. If you did not request a password reset,
            you can safely ignore this email — your password will not be changed.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
