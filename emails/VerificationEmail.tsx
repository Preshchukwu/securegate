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

interface VerificationEmailProps {
  name: string;
  verifyUrl: string;
}

export function VerificationEmail({ name, verifyUrl }: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your SecureGate email address</Preview>
      <Body style={{ backgroundColor: "#f4f6f9", fontFamily: "Inter, sans-serif" }}>
        <Container style={{ maxWidth: "480px", margin: "40px auto", backgroundColor: "#ffffff", borderRadius: "12px", padding: "40px" }}>
          <Heading style={{ color: "#1a3a5c", fontSize: "24px", marginBottom: "8px" }}>
            Verify your email
          </Heading>
          <Text style={{ color: "#374151", fontSize: "16px" }}>
            Hi {name}, click the button below to verify your SecureGate account.
          </Text>
          <Section style={{ textAlign: "center", margin: "32px 0" }}>
            <Button
              href={verifyUrl}
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
              Verify email address
            </Button>
          </Section>
          <Text style={{ color: "#6b7280", fontSize: "14px" }}>
            This link expires in <strong>15 minutes</strong>. If you did not create an account, you
            can safely ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
